package app.service;

import app.model.SocketMessage;
import app.utils.JsonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import static app.utils.FunctionalUtils.or;
import static java.util.stream.Collectors.toList;

@Service
public class SocketManager {
    private static final Logger logger = LoggerFactory.getLogger(SocketManager.class);
    private Map<String, SocketChannel> channels;

    public SocketManager() {
        this.channels = new ConcurrentHashMap<>();
    }

    public void subscribe(String channelId, WebSocketSession session) {
        if (channelId == null) {
            return;
        }
        SocketChannel channel = or(channels.get(channelId), new SocketChannel(channelId));
        channel.addSession(session);
        channels.put(channelId, channel);
    }

    public List<String> clean(WebSocketSession session) {
        List<String> cleaned = channels.entrySet().stream()
            .filter(entry -> !entry.getValue().clean(session))
            .map(Map.Entry::getKey)
            .collect(toList());
        cleaned.forEach(channels::remove);
        return cleaned;
    }

    public void broadcast(String channelId, SocketMessage<?> message) {
        broadcast(channelId, JsonUtils.stringify(message));
    }

    public void broadcast(String channelId, String message) {
        broadcast(channelId, new TextMessage(message));
    }

    public List<String> getChannelIds() {
        return channels.keySet()
            .stream()
            .collect(toList());
    }

    private void broadcast(String channelId, TextMessage message) {
        if (channelId == null) {
            broadcast(message);
        } else {
            SocketChannel channel = channels.get(channelId);
            if (channel != null) {
                channel.broadcast(message);
            }
        }
    }

    private void broadcast(TextMessage message) {
        if (message == null) {
            return;
        }
        channels.values().forEach(channel -> channel.broadcast(message));
    }

    static boolean send(WebSocketSession session, Object message, String channelId) {
        return send(session, JsonUtils.stringify(message), channelId);
    }

    static boolean send(WebSocketSession session, Object message) {
        return send(session, JsonUtils.stringify(message));
    }

    static boolean send(WebSocketSession session, String message, String channelId) {
        return send(session, new TextMessage(message), channelId);
    }

    static boolean send(WebSocketSession session, String message) {
        return send(session, new TextMessage(message), null);
    }

    static boolean send(WebSocketSession session, TextMessage message, String channelId) {
        try {
            if (channelId == null) {
                logger.info("sending message to: " + session.toString() + " with payload: '" + message.getPayload() + "'");
            } else {
                logger.info("sending message to: " + session.toString() + " with channelId: '" + channelId + "' and payload: '" + message.getPayload() + "'");
            }
            session.sendMessage(message);
            return true;
        } catch (IOException e) {
            logger.info("failed to send socket message" + e);
            return false;
        }
    }
}
