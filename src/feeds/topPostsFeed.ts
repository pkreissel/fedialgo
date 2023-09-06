import { mastodon } from "masto";
import FeatureStore from "../features/FeatureStore";
import { camelCase, snakeCase } from "change-case";

export default async function getTopPostFeed(api: mastodon.rest.Client): Promise<mastodon.v1.Status[]> {
    const core_servers = await FeatureStore.getCoreServer(api)
    let results: any[] = [];

    //Masto does not support top posts from foreign servers, so we have to do it manually
    const isRecord = (x: unknown): x is Record<string, unknown> =>
        typeof x === "object" && x !== null && x.constructor.name === "Object";
    const _transformKeys = <T>(
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
    //Get Top Servers
    const servers = Object.keys(core_servers).sort((a, b) => {
        return core_servers[b] - core_servers[a]
    }).slice(0, 10)

    results = await Promise.all(servers.map(async (server: string): Promise<mastodon.v1.Status[]> => {
        if (server === "undefined" || typeof server == "undefined" || server === "") return [];
        let res, json;
        try {
            res = await fetch("https://" + server + "/api/v1/trends/statuses")
            json = await res.json();
        }
        catch (e) {
            console.log(e)
            return [];
        }
        if (!res.ok) {
            return [];
        }
        const data: any[] = _transformKeys(json, camelCase);
        if (data === undefined) {
            return [];
        }
        return data.map((status: any) => {
            status.topPost = true;
            return status;
        }).slice(0, 10)
    }))
    console.log(results)
    return results.flat();
}