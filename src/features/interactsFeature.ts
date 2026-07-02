import { mastodon } from "masto";
import { accFeatureType } from "../types";

export default async function interactFeature(api: mastodon.rest.Client): Promise<accFeatureType> {
    let results: mastodon.v1.Notification[] = [];
    let pages = 5;
    try {
        for await (const page of api.v1.notifications.list({ limit: 80 })) {
            results = results.concat(page)
            pages--;
            if (pages === 0 || page.length < 10) {
                break;
            }
        }
    } catch (e) {
        console.error(e)
        return {};
    }

    const interactFrequ = results.reduce((accumulator: Record<string, number>, status: mastodon.v1.Notification,) => {
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