"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function getReblogsFeature(api) {
    let results = [];
    let pages = 3;
    try {
        for await (const page of api.v1.timelines.home.list({ limit: 80 })) {
            results = results.concat(page);
            pages--;
            if (pages === 0 || results.length < 80) {
                break;
            }
        }
    }
    catch (e) {
        console.error(e);
        return {};
    }
    const reblogFrequ = results.reduce((accumulator, status) => {
        if (status.reblog) {
            if (status.reblog.account.acct in accumulator) {
                accumulator[status.reblog.account.acct] += 1;
            }
            else {
                accumulator[status.reblog.account.acct] = 1;
            }
        }
        return accumulator;
    }, {});
    return reblogFrequ;
}
exports.default = getReblogsFeature;
