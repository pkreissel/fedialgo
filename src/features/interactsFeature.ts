import { mastodon } from "masto";
import { accFeatureType } from "../types";

export default async function interactFeature(api: mastodon.rest.Client): Promise<accFeatureType> {
    let results: any[] = [];
    let pages = 3;
    for await (const page of api.v1.notifications.list({ limit: 80 })) {
        results = results.concat(page)
        pages--;
        if (pages === 0 || results.length < 80) {
            break;
        }
    }

    const interactFrequ = results.reduce((accumulator: any, status: mastodon.v1.Status,) => {
        if (!status.account) return accumulator;
        if (status.account.acct in accumulator) {
            accumulator[status.account.acct] += 1;
        } else {
            accumulator[status.account.acct] = 1;
        }

        return accumulator
    }, {})

    return interactFrequ;
}