"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getReblogsFeature;
async function getReblogsFeature(api, user) {
    let results = [];
    let pages = 5;
    try {
        for await (const page of api.v1.accounts.$select(user.id).statuses.list({ limit: 80 })) {
            results = results.concat(page);
            pages--;
            if (pages === 0 || page.length < 10) {
                break;
            }
        }
    }
    catch (e) {
        console.error(e);
        return {};
    }
    console.log(results);
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
    console.log(reblogFrequ);
    return reblogFrequ;
}
