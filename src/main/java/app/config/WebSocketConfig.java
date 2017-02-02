package app.config;

import app.handler.WebSocketHandler;
import app.service.SocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    private final SocketService socketService;

    @Autowired
    public WebSocketConfig(SocketService socketService) {
        this.socketService = socketService;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(myHandler(), "/socket")
            .setAllowedOrigins("*");
    }

    @Bean
    public WebSocketHandler myHandler() {
        return new WebSocketHandler(socketService);
    }

}
