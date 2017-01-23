package app.service;

import org.springframework.stereotype.Service;

@Service
public class SocketChannelFactory {
    public SocketChannel socketChannel(String channelId, SocketSender sender) {
        return new SocketChannel(channelId, sender);
    }
}
