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
public class SocketHandler {
    private final SocketManager socketManager;

    @Autowired
    public SocketHandler(SocketManager socketManager) {
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
        socketManager.clean(session)
            .forEach(this::notifyManagerDisconnect);
    }

    public void subscribe(String channelId, WebSocketSession session) {
        socketManager.subscribe(channelId, session);
        if (channelId.equals("manager")) {
            socketManager.getChannelIds().forEach(this::notifyManagerConnect);
        } else {
            notifyManagerConnect(channelId);
        }
    }

    private void handleMessage(StringSocketMessage message, WebSocketSession session) {
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
    }

    private void handleUnknownMessage(WebSocketSession session) {
        SocketManager.send(session, new StringSocketMessage("error", "Unknown Event"));
    }

    private void notifyManagerConnect(String channelId) {
        notifyManager("connected", simpleMap("id", channelId));
    }

    private void notifyManagerDisconnect(String channelId) {
        notifyManager("disconnected", simpleMap("id", channelId));
    }

    private void notifyManager(String event, Map<String, String> payload) {
        notify("manager", event, payload);
    }

    private void notify(String channelId, String event, Map<String, String> payload) {
        socketManager.broadcast(channelId, new MapSocketMessage(event, payload));
    }
}
