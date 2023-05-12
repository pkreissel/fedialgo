import { mastodon } from "masto";

export default async function getHomeFeed(api: mastodon.Client, user: mastodon.v1.Account) {
    let results: any[] = [];
    let pages = 10;
    for await (const page of api.v1.timelines.listHome()) {
        results = results.concat(page)
        pages--;
        //check if status is less than 12 hours old
        if (pages === 0 || new Date(page[0].createdAt) < new Date(Date.now() - 43200000)) {
            break;
        }
    }
    return results;
}