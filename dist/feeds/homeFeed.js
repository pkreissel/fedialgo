"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function getHomeFeed(api, user) {
    let results = [];
    let pages = 10;
    for await (const page of api.v1.timelines.home.list()) {
        results = results.concat(page);
        pages--;
        //check if status is less than 12 hours old
        if (pages === 0 || new Date(page[0].createdAt) < new Date(Date.now() - 43200000)) {
            break;
        }
    }
    return results;
}
exports.default = getHomeFeed;
