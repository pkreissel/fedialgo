"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function interactFeature(api) {
    let results = [];
    let pages = 5;
    try {
        for await (const page of api.v1.notifications.list({ limit: 80 })) {
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
    const interactFrequ = results.reduce((accumulator, status) => {
        if (!status.account)
            return accumulator;
        if (status.account.acct in accumulator) {
            accumulator[status.account.acct] += 1;
        }
        else {
            accumulator[status.account.acct] = 1;
        }
        return accumulator;
    }, {});
    return interactFrequ;
}
exports.default = interactFeature;
