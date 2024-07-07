"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mastodonFetch = exports._transformKeys = exports.isRecord = void 0;
const axios_1 = __importDefault(require("axios"));
const change_case_1 = require("change-case");
//Masto does not support top posts from foreign servers, so we have to do it manually
const isRecord = (x) => typeof x === "object" && x !== null && x.constructor.name === "Object";
exports.isRecord = isRecord;
const _transformKeys = (data, transform) => {
    if (Array.isArray(data)) {
        return data.map((value) => (0, exports._transformKeys)(value, transform));
    }
    if ((0, exports.isRecord)(data)) {
        return Object.fromEntries(Object.entries(data).map(([key, value]) => [
            transform(key),
            (0, exports._transformKeys)(value, transform),
        ]));
    }
    return data;
};
exports._transformKeys = _transformKeys;
const mastodonFetch = async (server, endpoint) => {
    const json = await axios_1.default.get(`https://${server}${endpoint}`);
    if (!(json.status === 200) || !json.data) {
        console.error(`Error fetching data for server ${server}:`, json);
        return;
    }
    const data = (0, exports._transformKeys)(json.data, change_case_1.camelCase);
    return data;
};
exports.mastodonFetch = mastodonFetch;
