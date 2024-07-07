import axios from "axios";
import { camelCase } from "change-case";

//Masto does not support top posts from foreign servers, so we have to do it manually
export const isRecord = (x: unknown): x is Record<string, unknown> =>
    typeof x === "object" && x !== null && x.constructor.name === "Object";
export const _transformKeys = <T>(
    data: T,
    transform: (key: string) => string,
): T => {
    if (Array.isArray(data)) {
        return data.map((value) =>
            _transformKeys<T>(value, transform),
        ) as T;
    }

    if (isRecord(data)) {
        return Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
                transform(key),
                _transformKeys(value, transform),
            ]),
        ) as T;
    }
    return data as T;
};

export const mastodonFetch = async <T>(server: string, endpoint: string): Promise<T | undefined> => {
    const json = await axios.get<T>(`https://${server}${endpoint}`)
    if (!(json.status === 200) || !json.data) {
        console.error(`Error fetching data for server ${server}:`, json);
        return
    }
    const data: T = _transformKeys(json.data, camelCase)
    return data;
}
