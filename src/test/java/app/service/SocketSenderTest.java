package app.service;

import app.model.ListSocketMessage;
import app.model.SocketMessage;
import app.utils.JsonUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;

import static java.util.Arrays.asList;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.*;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
public class SocketSenderTest {
    @Mock
    private WebSocketSession session;
    private SocketSender sender;

    @Before
    public void setup() {
        sender = new SocketSender();
    }

    @Test
    public void send() throws Exception {
        SocketMessage<?> message = new ListSocketMessage("some-type", asList("item1", "item2", "item3"));
        TextMessage expectedMessage = new TextMessage(JsonUtils.stringify(message));

        boolean result = sender.send(session, message, "channel-id");

        assertThat(result, equalTo(true));
        verify(session).sendMessage(expectedMessage);
    }

    @Test
    public void send_failsToSendMessage() throws Exception {
        doThrow(Exception.class).when(session).sendMessage(any());

        boolean result = sender.send(session, "message", "channel");

        assertThat(result, equalTo(false));
    }
}