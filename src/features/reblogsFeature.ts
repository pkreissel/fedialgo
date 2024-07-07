import { mastodon } from "masto";

export default async function getReblogsFeature(api: mastodon.rest.Client) {
    let results: mastodon.v1.Status[] = [];
    let pages = 3;
    try {
        for await (const page of api.v1.timelines.home.list({ limit: 80 })) {
            results = results.concat(page)
            pages--;
            if (pages === 0 || results.length < 80) {
                break;
            }
        }
    } catch (e) {
        console.error(e)
        return {};
    }

    const reblogFrequ = results.reduce((accumulator: Record<string, number>, status: mastodon.v1.Status) => {
        if (status.reblog) {
            if (status.reblog.account.acct in accumulator) {
                accumulator[status.reblog.account.acct] += 1;
            } else {
                accumulator[status.reblog.account.acct] = 1;
            }
        }
        return accumulator
    }, {})

    return reblogFrequ;
}