package app.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class StringSocketMessage extends SocketMessage<String> {
    @JsonCreator
    public StringSocketMessage(
        @JsonProperty("event") String event,
        @JsonProperty("payload") String payload
    ) {
        super(event, payload);
    }
}
