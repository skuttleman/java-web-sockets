package app.service;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import static app.service.SocketManager.send;

public class SocketChannel {
    private final String channelId;
    private List<WebSocketSession> sessions;

    public SocketChannel(String channelId) {
        this.channelId = channelId;
        this.sessions = new CopyOnWriteArrayList<>();
    }

    public void addSession(WebSocketSession session) {
        this.sessions.add(session);
    }

    public boolean clean(WebSocketSession session) {
        sessions.removeIf(socket -> socket == session);
        return sessions.size() > 0;
    }

    public void broadcast(TextMessage message) {
        sessions.forEach(session -> send(session, message, channelId));
    }
}
