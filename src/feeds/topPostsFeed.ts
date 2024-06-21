import { mastodon } from "masto";
import FeatureStore from "../features/FeatureStore";
import { camelCase, snakeCase } from "change-case";
import { StatusType } from "../types";
import Storage from "../Storage";
import { _transformKeys } from "../helpers";

export default async function getTopPostFeed(api: mastodon.rest.Client): Promise<StatusType[]> {
    const core_servers = await FeatureStore.getCoreServer(api)
    let results: any[] = [];


    //Get Top Servers
    const servers = Object.keys(core_servers).sort((a, b) => {
        return core_servers[b] - core_servers[a]
    }).slice(0, 10)

    if (servers.length === 0) {
        return [];
    }

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
        const data: StatusType[] = _transformKeys(json, camelCase);
        if (data === undefined) {
            return [];
        }
        return data.map((status: StatusType) => {
            status.topPost = true;
            return status;
        }).slice(0, 10)
    }))
    console.log(results)

    const lastOpened = new Date(await Storage.getLastOpened() - 28800000) ?? new Date(0)
    return results.flat().filter((status: StatusType) => new Date(status.createdAt) > lastOpened)
}