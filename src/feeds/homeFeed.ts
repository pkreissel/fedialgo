import { mastodon } from "masto";
import Storage from "../Storage";
import { StatusType } from "../types";

export default async function getHomeFeed(api: mastodon.rest.Client, _user: mastodon.v1.Account): Promise<StatusType[]> {
    let results: StatusType[] = [];
    let pages = 10;
    const lastOpened = new Date((await Storage.getLastOpened() ?? 0) - 600)
    const defaultCutoff = new Date(Date.now() - 43200000)
    const dateCutoff = lastOpened < defaultCutoff ? defaultCutoff : lastOpened
    console.log("Date Cutoff: ", dateCutoff)
    for await (const page of api.v1.timelines.home.list()) {
        results = results.concat(page as StatusType[]);
        pages--;
        //check if status is less than 12 hours old
        if (pages === 0 || new Date(page[0].createdAt) < dateCutoff) {
            break;
        }
    }
    return results;
}