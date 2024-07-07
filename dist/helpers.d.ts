export declare const isRecord: (x: unknown) => x is Record<string, unknown>;
export declare const _transformKeys: <T>(data: T, transform: (key: string) => string) => T;
export declare const mastodonFetch: <T>(server: string, endpoint: string) => Promise<T | undefined>;
