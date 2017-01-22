package app.utils;

import java.util.HashMap;
import java.util.Map;

import static app.utils.FunctionalUtils.complement;
import static app.utils.FunctionalUtils.or;
import static java.util.Arrays.stream;
import static java.util.stream.Collectors.toMap;

public class DataUtils {
    public static Map<String, String> parseQuery(String query) {
        return parseMap(or(query, ""), "&", "=");
    }

    public static Map<String, String> parseCookie(String cookie) {
        return parseMap(or(cookie, ""), ";", "=");
    }

    private static Map<String, String> parseMap(String string, String splitPairOn, String splitKeyValueOn) {
        String[] params = string.split(splitPairOn);
        return stream(params)
            .filter(complement(String::isEmpty))
            .map(pairs -> pairs.split(splitKeyValueOn))
            .collect(toMap(
                strings -> strings[0].trim(),
                strings -> strings[1].trim()));
    }

    public static <K, V> Map<K, V> simpleMap(K key, V value) {
        Map<K, V> map = new HashMap<>();
        map.put(key, value);
        return map;
    }
}
