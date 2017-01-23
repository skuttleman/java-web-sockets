package app.service;

import app.model.SocketMessage;
import app.utils.JsonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import static app.utils.FunctionalUtils.or;
import static java.util.stream.Collectors.toList;

@Service
public class SocketManager {
    private final SocketSender sender;
    private final SocketChannelFactory factory;
    private Map<String, SocketChannel> channels;

    @Autowired
    public SocketManager(SocketSender sender, SocketChannelFactory factory) {
        this.sender = sender;
        this.factory = factory;
        this.channels = new ConcurrentHashMap<>();
    }

    public void subscribe(String channelId, WebSocketSession session) {
        if (channelId == null) {
            return;
        }
        SocketChannel channel = or(channels.get(channelId), factory.socketChannel(channelId, sender));
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
}
