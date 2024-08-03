import { mastodon } from "masto";
import { serverFeatureType } from "../types";
import { _transformKeys, mastodonFetch } from "../helpers";


async function getMonthlyUsers(server: string): Promise<number> {
    try {
        const instance = await mastodonFetch<mastodon.v2.Instance>(server, "api/v2/instance")
        console.log(instance)
        return instance ? instance.usage.users.activeMonth : 0;
    } catch (error) {
        console.error(`Error fetching data for server ${server}:`, error);
        return 0; // Return 0 if we can't get the data
    }
}

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
        console.error(e)
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

    console.log(serverFrequ)

    // for top 20 servers
    const top20 = Object.keys(serverFrequ).sort((a, b) => serverFrequ[b] - serverFrequ[a]).slice(0, 30)

    console.log("Top 30 servers: ", top20)
    const monthlyUsers = await Promise.all(top20.map(server => getMonthlyUsers(server)))

    console.log("Monthly Users: ", monthlyUsers)

    const overrepresentedServerFrequ = top20.reduce((acc, server, index) => {
        const activeUsers = monthlyUsers[index];
        if (activeUsers < 10) return acc;
        const ratio = serverFrequ[server] / activeUsers;
        return { ...acc, [server]: ratio }
    }, {})

    return overrepresentedServerFrequ;
}