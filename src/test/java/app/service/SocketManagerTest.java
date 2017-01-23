package app.service;

import app.model.SocketMessage;
import app.model.StringSocketMessage;
import app.utils.JsonUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.List;

import static java.util.Arrays.asList;
import static java.util.Collections.emptyList;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.*;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class SocketManagerTest {
    @Mock
    private SocketSender sender;
    @Mock
    private SocketChannelFactory factory;
    @Mock
    private SocketChannel channel;
    @Mock
    private WebSocketSession session1;
    @Mock
    private WebSocketSession session2;
    private SocketManager manager;

    @Before
    public void setup() {
        manager = new SocketManager(sender, factory);
        when(factory.socketChannel(any(), any())).thenReturn(channel);
    }

    @Test
    public void subscribe_addsSession() throws Exception {
        manager.subscribe("channel-id", session1);
        manager.subscribe("channel-id", session2);
        List<String> ids = manager.getChannelIds();

        verify(channel).addSession(session1);
        verify(channel).addSession(session2);
        assertThat(ids, equalTo(asList("channel-id")));
    }

    @Test
    public void subscribe_ignoresNullChannel() throws Exception {
        manager.subscribe("channel-id", session1);
        verify(factory).socketChannel("channel-id", sender);
        manager.subscribe(null, session1);
        verifyNoMoreInteractions(factory);
    }

    @Test
    public void clean() throws Exception {
        manager.subscribe("channel-id", session1);
        manager.subscribe("channel-id", session2);
        when(channel.clean(any())).thenReturn(true);
        List<String> cleaned = manager.clean(session1);

        verify(channel).clean(session1);
        assertThat(cleaned, equalTo(emptyList()));

        when(channel.clean(any())).thenReturn(false);
        cleaned = manager.clean(session2);

        verify(channel).clean(session2);
        assertThat(cleaned, equalTo(asList("channel-id")));
    }

    @Test
    public void broadcast() throws Exception {
        manager.subscribe("channel-id", session1);
        SocketMessage<?> message = new StringSocketMessage("type", "message");
        String json = JsonUtils.stringify(message);
        manager.broadcast("channel-id", message);

        verify(channel).broadcast(new TextMessage(json));
    }

    @Test
    public void getChannelIds() throws Exception {
        manager.subscribe("channel-id1", session1);
        manager.subscribe("channel-id1", session2);
        manager.subscribe("channel-id2", session1);

        List<String> ids = manager.getChannelIds();

        assertThat(ids, equalTo(asList("channel-id2", "channel-id1")));
    }
}