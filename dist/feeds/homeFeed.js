"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Storage_1 = __importDefault(require("../Storage"));
async function getHomeFeed(api, _user) {
    let results = [];
    let pages = 10;
    const lastOpened = new Date((await Storage_1.default.getLastOpened() ?? 0) - 600);
    const defaultCutoff = new Date(Date.now() - 43200000);
    const dateCutoff = lastOpened < defaultCutoff ? defaultCutoff : lastOpened;
    console.log("Date Cutoff: ", dateCutoff);
    for await (const page of api.v1.timelines.home.list()) {
        results = results.concat(page);
        pages--;
        //check if status is less than 12 hours old
        if (pages === 0 || new Date(page[0].createdAt) < dateCutoff) {
            break;
        }
    }
    return results;
}
exports.default = getHomeFeed;
