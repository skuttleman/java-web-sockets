package app.controller;

import app.model.StringSocketMessage;
import app.service.SocketHandler;
import app.utils.JsonUtils;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.http.HttpHeaders;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.net.URI;

import static org.junit.Assert.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class WebSocketControllerTest {
    @Mock
    private WebSocketSession session;
    @Mock
    private SocketHandler handler;
    private WebSocketController controller;

    @Before
    public void setup() throws Exception {
        controller = new WebSocketController(handler);
        when(session.getUri()).thenReturn(new URI("http", "www.example.com", "/some/path", "id=1234", null));
        when(session.getHandshakeHeaders()).thenReturn(new HttpHeaders());
    }

    @Test
    public void afterConnectionEstablished() throws Exception {
        controller.afterConnectionEstablished(session);

        verify(session).getUri();
        verify(handler).subscribe("1234", session);
    }

    @Test
    public void afterConnectionClosed() throws Exception {
        controller.afterConnectionClosed(session, null);

        verify(handler).handleDisconnect(session);
    }

    @Test
    public void handleTextMessage() throws Exception {
        String json = JsonUtils.stringify(new StringSocketMessage("type", "payload"));

        controller.handleTextMessage(session, new TextMessage(json));

        verify(handler).handleMessage(new StringSocketMessage("type", "payload"), session);
    }
}