package app.config;

import app.service.SocketManager;
import app.service.SocketSender;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MainConfig {
    @Bean
    ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

    @Bean
    SocketSender socketSender() {
        return new SocketSender();
    }
}
