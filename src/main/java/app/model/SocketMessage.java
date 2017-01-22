package app.model;

public abstract class SocketMessage<T> {
    private String event;
    private T payload;

    public SocketMessage(String event, T payload) {
        this.event = event;
        this.payload = payload;
    }

    public String getEvent() {
        return event;
    }

    public T getPayload() {
        return payload;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        SocketMessage<?> that = (SocketMessage<?>) o;

        if (event != null ? !event.equals(that.event) : that.event != null) return false;
        return payload != null ? payload.equals(that.payload) : that.payload == null;
    }

    @Override
    public int hashCode() {
        int result = event != null ? event.hashCode() : 0;
        result = 31 * result + (payload != null ? payload.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "SocketMessage{" +
            "event='" + event + '\'' +
            ", payload=" + payload +
            '}';
    }
}
