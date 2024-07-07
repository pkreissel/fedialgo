"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FeatureStore_1 = __importDefault(require("../features/FeatureStore"));
const Storage_1 = __importDefault(require("../Storage"));
const helpers_1 = require("../helpers");
async function getTopPostFeed(api) {
    const core_servers = await FeatureStore_1.default.getCoreServer(api);
    let results = [];
    //Get Top Servers
    const servers = Object.keys(core_servers).sort((a, b) => {
        return core_servers[b] - core_servers[a];
    }).slice(0, 10);
    if (servers.length === 0) {
        return [];
    }
    results = await Promise.all(servers.map(async (server) => {
        if (server === "undefined" || typeof server == "undefined" || server === "")
            return [];
        const data = await (0, helpers_1.mastodonFetch)(server, "api/v1/timelines/public");
        return data?.map((status) => {
            status.topPost = true;
            return status;
        }).slice(0, 10) ?? [];
    }));
    console.log(results);
    const lastOpened = new Date((await Storage_1.default.getLastOpened() ?? 0) - 28800000);
    return results.flat().filter((status) => new Date(status.createdAt) > lastOpened);
}
exports.default = getTopPostFeed;
