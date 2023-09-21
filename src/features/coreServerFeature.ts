import { mastodon } from "masto";
import { serverFeatureType } from "../types";

export default async function coreServerFeature(api: mastodon.rest.Client, user: mastodon.v1.Account): Promise<serverFeatureType> {
    let results: mastodon.v1.Account[] = [];
    let pages = 10;
    try {
        for await (const page of api.v1.accounts.$select(user.id).following.list({ limit: 80 })) {
            results = results.concat(page)
            pages--;
            if (pages === 0 || results.length < 80) {
                break;
            }
        }
    } catch (e) {
        return {};
    }

    const serverFrequ = results.reduce((accumulator: serverFeatureType, follower: mastodon.v1.Account) => {
        const server = follower.url.split("@")[0].split("https://")[1];
        if (server in accumulator) {
            accumulator[server] += 1;
        } else {
            accumulator[server] = 1;
        }
        return accumulator
    }, {})

    return serverFrequ;
}