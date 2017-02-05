package app.utils;

@FunctionalInterface
public interface Thunk<T> {
    public T evaluate();
}
