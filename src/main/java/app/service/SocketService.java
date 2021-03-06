package app.service;

import app.model.ListSocketMessage;
import app.model.MapSocketMessage;
import app.model.SocketMessage;
import app.model.StringSocketMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;

import java.util.Map;

import static app.utils.DataUtils.parseQuery;
import static app.utils.DataUtils.simpleMap;

@Service
public class SocketService {
    private final SocketManager socketManager;
    private final SocketSender sender;

    @Autowired
    public SocketService(SocketManager socketManager, SocketSender sender) {
        this.sender = sender;
        this.socketManager = socketManager;
    }

    public void handleMessage(SocketMessage<?> message, WebSocketSession session) {
        if (message instanceof MapSocketMessage) {
            handleMessage((MapSocketMessage) message, session);
        } else if (message instanceof ListSocketMessage) {
            handleMessage((ListSocketMessage) message, session);
        } else if (message instanceof StringSocketMessage) {
            handleMessage((StringSocketMessage) message, session);
        } else {
            handleUnknownMessage(session);
        }
    }

    public void handleDisconnect(WebSocketSession session) {
        socketManager.clean(session).forEach(this::notifyDisconnect);
    }

    public void subscribe(String channelId, WebSocketSession session) {
        socketManager.subscribe(channelId, session);
        socketManager.getChannelIds().forEach(this::notifyConnect);
    }

    private void handleMessage(StringSocketMessage message, WebSocketSession session) {
        Map<String, String> payload = simpleMap("message", message.getPayload());
        handleMessage(new MapSocketMessage(message.getType(), payload), session);
    }

    private void handleMessage(MapSocketMessage message, WebSocketSession session) {
        Map<String, String> map = message.getPayload();
        Map<String, String> payload = simpleMap("message", map.get("message"));
        payload.put("from", parseQuery(session.getUri().getQuery()).get("id"));

        switch (message.getType()) {
            case "broadcast":
                notify(map.get("to"), "broadcast", payload);
                break;
            default:
                handleUnknownMessage(session);
        }
    }

    private void handleMessage(ListSocketMessage message, WebSocketSession session) {
        String type = message.getType();
        message.getPayload()
            .forEach(string -> handleMessage(new StringSocketMessage(type, string), session));
    }

    private void handleUnknownMessage(WebSocketSession session) {
        sender.send(session, new StringSocketMessage("error", "Unknown Message Type"));
    }

    private void notifyConnect(String channelId) {
        notifyAll("connected", simpleMap("id", channelId));
    }

    private void notifyDisconnect(String channelId) {
        notifyAll("disconnected", simpleMap("id", channelId));
    }

    private void notifyAll(String event, Map<String, String> payload) {
        notify(null, event, payload);
    }

    private void notify(String channelId, String event, Map<String, String> payload) {
        socketManager.broadcast(channelId, new MapSocketMessage(event, payload));
    }
}
