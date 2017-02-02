package app.handler;

import app.model.SocketMessage;
import app.service.SocketService;
import app.utils.JsonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.handler.TextWebSocketHandler;;

import java.io.IOException;

import static app.utils.DataUtils.parseQuery;

public class WebSocketHandler extends TextWebSocketHandler {
    private static final Logger logger = LoggerFactory.getLogger(WebSocketHandler.class);
    private final SocketService socketService;

    public WebSocketHandler(SocketService socketService) {
        this.socketService = socketService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws IOException {
        String id = parseQuery(session.getUri().getQuery()).get("id");
        logger.info("session established for: " + id);

        socketService.subscribe(id, session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        logger.info("session closed with status: " + status);

        socketService.handleDisconnect(session);
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage textMessage) {
        SocketMessage<?> message = JsonUtils.parseSocketMessage(textMessage.getPayload());

        logger.info("received socket message: " + message);

        socketService.handleMessage(message, session);
    }
}
