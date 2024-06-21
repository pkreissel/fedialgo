"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._transformKeys = exports.isRecord = void 0;
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
