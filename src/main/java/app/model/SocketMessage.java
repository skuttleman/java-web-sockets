package app.model;

public abstract class SocketMessage<T> {
    private String type;
    private T payload;

    public SocketMessage(String type, T payload) {
        this.type = type;
        this.payload = payload;
    }

    public String getType() {
        return type;
    }

    public T getPayload() {
        return payload;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        SocketMessage<?> that = (SocketMessage<?>) o;

        if (type != null ? !type.equals(that.type) : that.type != null) return false;
        return payload != null ? payload.equals(that.payload) : that.payload == null;
    }

    @Override
    public int hashCode() {
        int result = type != null ? type.hashCode() : 0;
        result = 31 * result + (payload != null ? payload.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "SocketMessage{" +
            "type='" + type + '\'' +
            ", payload=" + payload +
            '}';
    }
}
