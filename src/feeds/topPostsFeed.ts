import { mastodon } from "masto";
import FeatureStore from "../features/FeatureStore";
import { StatusType } from "../types";
import Storage from "../Storage";
import { _transformKeys, mastodonFetch } from "../helpers";

export default async function getTopPostFeed(api: mastodon.rest.Client): Promise<StatusType[]> {
    const core_servers = await FeatureStore.getCoreServer(api)
    let results: StatusType[][] = [];


    //Get Top Servers
    const servers = Object.keys(core_servers).sort((a, b) => {
        return core_servers[b] - core_servers[a]
    }).slice(0, 10)

    if (servers.length === 0) {
        return [];
    }

    results = await Promise.all(servers.map(async (server: string): Promise<StatusType[]> => {
        if (server === "undefined" || typeof server == "undefined" || server === "") return [];

        const data = await mastodonFetch<StatusType[]>(server, "api/v1/timelines/public")
        return data?.map((status: StatusType) => {
            status.topPost = true;
            return status;
        }).slice(0, 10) ?? []
    }))
    console.log(results)

    const lastOpened = new Date((await Storage.getLastOpened() ?? 0) - 28800000)
    return results.flat().filter((status: StatusType) => new Date(status.createdAt) > lastOpened)
}