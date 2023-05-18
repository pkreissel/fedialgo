import { SerializerNativeImpl, mastodon } from "masto";
import FeatureStore from "../features/FeatureStore";

export default async function getTopPostFeed(api: mastodon.Client): Promise<mastodon.v1.Status[]> {
    const core_servers = await FeatureStore.getCoreServer(api)
    let results: any[] = [];
    const serializer = new SerializerNativeImpl();
    //Get Top Servers
    const servers = Object.keys(core_servers).sort((a, b) => {
        return core_servers[b] - core_servers[a]
    }).slice(0, 10)

    results = await Promise.all(servers.map(async (server: string): Promise<mastodon.v1.Status[]> => {
        if (server === "undefined" || typeof server == "undefined" || server === "") return [];
        let res;
        try {
            res = await fetch("https://" + server + "/api/v1/trends/statuses")
        }
        catch (e) {
            return [];
        }
        if (!res.ok) {
            return [];
        }
        const data: any[] = serializer.deserialize('application/json', await res.text());
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