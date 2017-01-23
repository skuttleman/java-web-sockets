package app.controller;

import app.model.SocketMessage;
import app.service.SocketHandler;
import app.utils.JsonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;

import static app.utils.DataUtils.parseCookie;
import static app.utils.DataUtils.parseQuery;

public class WebSocketController extends TextWebSocketHandler {
    private static final Logger logger = LoggerFactory.getLogger(WebSocketController.class);
    private final SocketHandler socketHandler;

    public WebSocketController(SocketHandler socketHandler) {
        this.socketHandler = socketHandler;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws IOException {
        String id = parseQuery(session.getUri().getQuery()).get("id");
        logger.info("session established for: " + id);

        socketHandler.subscribe(id, session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        logger.info("session closed with status: " + status);

        socketHandler.handleDisconnect(session);
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage textMessage) {
        SocketMessage<?> message = JsonUtils.parseSocketMessage(textMessage.getPayload());

        logger.info("received socket message: " + message);

        socketHandler.handleMessage(message, session);
    }
}
