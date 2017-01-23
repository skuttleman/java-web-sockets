package app.service;

import app.model.MapSocketMessage;
import app.model.SocketMessage;
import app.model.StringSocketMessage;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.web.socket.WebSocketSession;

import java.net.URI;
import java.util.List;
import java.util.Map;

import static app.utils.DataUtils.simpleMap;
import static java.util.Arrays.asList;
import static org.junit.Assert.*;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class SocketHandlerTest {
    @Mock
    private SocketManager manager;
    @Mock
    private SocketSender sender;
    @Mock
    private WebSocketSession session;
    private SocketHandler handler;
    private Map<String, String> payload;

    @Before
    public void setup() throws Exception {
        handler = new SocketHandler(manager, sender);
        payload = simpleMap("message", "some-message");

        when(session.getUri()).thenReturn(new URI("http", "www.example.com", "/some/path", null, null));
    }

    @Test
    public void handleMessage_handlesBroadcast() throws Exception {
        payload.put("to", "some-channel");
        SocketMessage<?> message = new MapSocketMessage("broadcast", payload);
        handler.handleMessage(message, session);
        Map<String, String> newPayload = simpleMap("message", "some-message");
        newPayload.put("from", null);

        verify(manager).broadcast("some-channel", new MapSocketMessage("broadcast", newPayload));
    }

    @Test
    public void handleMessage_handlesUnknownMessage() throws Exception {
        SocketMessage<?> message = new MapSocketMessage("some-type", payload);
        handler.handleMessage(message, session);

        verify(sender).send(session, new StringSocketMessage("error", "Unknown Message Type"));
    }

    @Test
    public void handleDisconnect() throws Exception {
        List<String> list = asList("id1", "id2");
        when(manager.clean(any())).thenReturn(list);
        Map<String, String> payload1 = simpleMap("id", "id1");
        Map<String, String> payload2 = simpleMap("id", "id2");

        handler.handleDisconnect(session);

        verify(manager).clean(session);
        verify(manager).broadcast("manager", new MapSocketMessage("disconnected", payload1));
        verify(manager).broadcast("manager", new MapSocketMessage("disconnected", payload2));
    }

    @Test
    public void subscribe_notifiesNewManager() throws Exception {
        List<String> ids = asList("id1", "id2");
        when(manager.getChannelIds()).thenReturn(ids);
        Map<String, String> payload1 = simpleMap("id", "id1");
        Map<String, String> payload2 = simpleMap("id", "id2");

        handler.subscribe("manager", session);

        verify(manager).subscribe("manager", session);
        verify(manager).broadcast("manager", new MapSocketMessage("connected", payload1));
        verify(manager).broadcast("manager", new MapSocketMessage("connected", payload2));
    }

    @Test
    public void subscribe_updatesManager() throws Exception {
        List<String> ids = asList("id1", "id2");
        when(manager.getChannelIds()).thenReturn(ids);
        Map<String, String> payload = simpleMap("id", "non-manager");

        handler.subscribe("non-manager", session);

        verify(manager).subscribe("non-manager", session);
        verify(manager).broadcast("manager", new MapSocketMessage("connected", payload));
    }
}