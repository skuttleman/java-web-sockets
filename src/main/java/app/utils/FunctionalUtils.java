package app.utils;

import java.util.Objects;
import java.util.function.Predicate;

import static java.util.Arrays.stream;

public class FunctionalUtils {
    public static <T> T or(T... args) {
        return stream(args)
            .filter(Objects::nonNull)
            .findFirst()
            .orElse(null);
    }

    public static <T> Predicate<T> complement(Predicate<T> predicate) {
        return input -> !predicate.test(input);
    }
}
