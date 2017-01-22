package app.utils;

import app.model.ListSocketMessage;
import app.model.MapSocketMessage;
import app.model.SocketMessage;
import app.model.StringSocketMessage;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import static app.utils.FunctionalUtils.or;

@Component
public class JsonUtils {
    private static ObjectMapper objectMapper;
    private static final Logger logger = LoggerFactory.getLogger(JsonUtils.class);

    @Autowired
    public JsonUtils(ObjectMapper objectMapper) {
        JsonUtils.objectMapper = objectMapper;
    }

    public static SocketMessage<?> parseSocketMessage(String json) {
        return or(
            parse(json, MapSocketMessage.class),
            parse(json, ListSocketMessage.class),
            parse(json, StringSocketMessage.class)
        );
    }

    public static String stringify(Object object) {
        try {
            return objectMapper.writeValueAsString(object);
        } catch (Exception e) {
            logger.debug("failed to stringify: " + e);
            return null;
        }
    }

    public static <T> T parse(String json, Class<T> type) {
        try {
            return objectMapper.readerFor(type).readValue(json);
        } catch (Exception e) {
            logger.debug("failed to parse: " + e);
            return null;
        }
    }
}
