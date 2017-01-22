package app.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;

public class MapSocketMessage extends SocketMessage<Map<String, String>> {
    @JsonCreator
    public MapSocketMessage(
        @JsonProperty("type") String type,
        @JsonProperty("payload") Map<String, String> payload
    ) {
        super(type, payload);
    }
}
