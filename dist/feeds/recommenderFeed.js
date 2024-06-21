"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const change_case_1 = require("change-case");
const helpers_1 = require("../helpers");
async function getRecommenderFeed(api, user) {
    let data, res;
    try {
        res = await fetch("http://127.0.0.1:5000");
        data = await res.json();
    }
    catch (e) {
        console.log(e);
        return [];
    }
    if (!res.ok) {
        return [];
    }
    const statuses = data.statuses.map((status) => {
        status.recommended = true;
        return status;
    });
    return (0, helpers_1._transformKeys)(statuses, change_case_1.camelCase);
}
exports.default = getRecommenderFeed;
