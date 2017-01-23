package app.service;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.*;
import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
public class SocketChannelTest {
    @Mock
    private WebSocketSession session1;
    @Mock
    private WebSocketSession session2;
    @Mock
    private SocketSender sender;
    private SocketChannel channel;

    @Before
    public void setup() {
        channel = new SocketChannel("channel-id", sender);
        channel.addSession(session1);
        channel.addSession(session2);
    }

    @Test
    public void clean() throws Exception {
        boolean notEmpty = channel.clean(session1);
        assertThat(notEmpty, equalTo(true));

        notEmpty = channel.clean(session2);
        assertThat(notEmpty, equalTo(false));
    }

    @Test
    public void broadcast() throws Exception {
        TextMessage message = new TextMessage("some message");
        channel.broadcast(message);

        verify(sender).send(session1, message, "channel-id");
        verify(sender).send(session2, message, "channel-id");
    }


}