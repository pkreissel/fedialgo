"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function coreServerFeature(api, user) {
    let results = [];
    let pages = 10;
    for await (const page of api.v1.accounts.$select(user.id).following.list({ limit: 80 })) {
        results = results.concat(page);
        pages--;
        if (pages === 0 || results.length < 80) {
            break;
        }
    }
    const serverFrequ = results.reduce((accumulator, follower) => {
        const server = follower.url.split("@")[0].split("https://")[1];
        if (server in accumulator) {
            accumulator[server] += 1;
        }
        else {
            accumulator[server] = 1;
        }
        return accumulator;
    }, {});
    return serverFrequ;
}
exports.default = coreServerFeature;
