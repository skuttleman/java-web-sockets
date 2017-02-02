package app.handler;

import app.service.SocketService;
import app.model.StringSocketMessage;
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
public class WebSocketHandlerTest {
    @Mock
    private WebSocketSession session;
    @Mock
    private SocketService service;
    private WebSocketHandler controller;

    @Before
    public void setup() throws Exception {
        controller = new WebSocketHandler(service);
        when(session.getUri()).thenReturn(new URI("http", "www.example.com", "/some/path", "id=1234", null));
        when(session.getHandshakeHeaders()).thenReturn(new HttpHeaders());
    }

    @Test
    public void afterConnectionEstablished() throws Exception {
        controller.afterConnectionEstablished(session);

        verify(session).getUri();
        verify(service).subscribe("1234", session);
    }

    @Test
    public void afterConnectionClosed() throws Exception {
        controller.afterConnectionClosed(session, null);

        verify(service).handleDisconnect(session);
    }

    @Test
    public void handleTextMessage() throws Exception {
        String json = JsonUtils.stringify(new StringSocketMessage("type", "payload"));

        controller.handleTextMessage(session, new TextMessage(json));

        verify(service).handleMessage(new StringSocketMessage("type", "payload"), session);
    }
}