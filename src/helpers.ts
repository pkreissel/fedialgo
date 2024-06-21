//Masto does not support top posts from foreign servers, so we have to do it manually
export const isRecord = (x: unknown): x is Record<string, unknown> =>
    typeof x === "object" && x !== null && x.constructor.name === "Object";
export const _transformKeys = <T>(
    data: unknown,
    transform: (key: string) => string,
): T => {
    if (Array.isArray(data)) {
        return data.map((value) =>
            _transformKeys(value, transform),
        ) as unknown as T;
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