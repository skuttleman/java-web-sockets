package app.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class ListSocketMessage extends SocketMessage<List<String>> {
    @JsonCreator
    public ListSocketMessage(
        @JsonProperty("event") String event,
        @JsonProperty("payload") List<String> payload
    ) {
        super(event, payload);
    }
}
