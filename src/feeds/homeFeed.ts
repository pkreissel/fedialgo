import { mastodon } from "masto";
import Storage from "../Storage";

export default async function getHomeFeed(api: mastodon.rest.Client, user: mastodon.v1.Account) {
    let results: any[] = [];
    let pages = 10;
    const lastOpened = new Date(await Storage.getLastOpened()) ?? new Date(0)
    const defaultCutoff = new Date(Date.now() - 43200000)
    const dateCutoff = lastOpened < defaultCutoff ? defaultCutoff : lastOpened
    console.log("Date Cutoff: ", dateCutoff)
    for await (const page of api.v1.timelines.home.list()) {
        results = results.concat(page)
        pages--;
        //check if status is less than 12 hours old
        if (pages === 0 || new Date(page[0].createdAt) < dateCutoff) {
            break;
        }
    }
    return results;
}