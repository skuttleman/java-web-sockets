package app.service;

import app.utils.JsonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;

@Service
public class SocketSender {
    private static final Logger logger = LoggerFactory.getLogger(SocketSender.class);

    public boolean send(WebSocketSession session, Object message, String channelId) {
        return send(session, JsonUtils.stringify(message), channelId);
    }

    public boolean send(WebSocketSession session, Object message) {
        return send(session, JsonUtils.stringify(message));
    }

    public boolean send(WebSocketSession session, String message, String channelId) {
        return send(session, new TextMessage(message), channelId);
    }

    public boolean send(WebSocketSession session, String message) {
        return send(session, new TextMessage(message), null);
    }

    public boolean send(WebSocketSession session, TextMessage message, String channelId) {
        try {
            if (channelId == null) {
                logger.info("sending message to: {} with payload: '{}'", session, message.getPayload());
            } else {
                logger.info("sending message to: {} with channelId '{}' and  payload: '{}'", session, channelId, message.getPayload());
            }
            session.sendMessage(message);
            return true;
        } catch (Exception e) {
            logger.debug("failed to send socket message" + e);
            return false;
        }
    }
}
