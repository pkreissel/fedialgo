import { mastodon } from "masto";
import { StatusType } from "../types";
import { camelCase, snakeCase } from "change-case";
import { _transformKeys } from "../helpers";

export default async function getRecommenderFeed(api: mastodon.rest.Client, user: mastodon.v1.Account): Promise<StatusType[]> {
    let data, res;
    try {
        res = await fetch("http://127.0.0.1:5000")
        data = await res.json()
    } catch (e) {
        console.log(e)
        return [];
    }
    if (!res.ok) {
        return [];
    }
    const statuses = data.statuses.map((status: any) => {
        status.recommended = true;
        return status;
    })
    return _transformKeys(statuses, camelCase);
}