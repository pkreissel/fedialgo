"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Key = void 0;
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
var Key;
(function (Key) {
    Key["TOP_FAVS"] = "favs";
    Key["TOP_REBLOGS"] = "reblogs";
    Key["TOP_INTERACTS"] = "interacts";
    Key["CORE_SERVER"] = "coreServer";
    Key["USER"] = "algouser";
    Key["WEIGHTS"] = "weights";
    Key["OPENINGS"] = "openings";
    Key["LAST_OPENED"] = "lastOpened";
})(Key || (exports.Key = Key = {}));
class Storage {
    static async get(key, groupedByUser = true, suffix = "") {
        const suffixKey = this.suffix(key, suffix);
        const storageKey = groupedByUser ? await this.prefix(suffixKey) : suffixKey;
        const jsonValue = await async_storage_1.default.getItem(storageKey);
        const value = jsonValue != null ? JSON.parse(jsonValue) : null;
        return value != null ? value[storageKey] : null;
    }
    static async set(key, value, groupedByUser = true, suffix = "") {
        const suffixKey = this.suffix(key, suffix);
        const storageKey = groupedByUser ? await this.prefix(suffixKey) : suffixKey;
        const jsonValue = JSON.stringify({ [storageKey]: value });
        await async_storage_1.default.setItem(storageKey, jsonValue);
    }
    static suffix(key, suffix) {
        if (suffix === "")
            return key;
        return `${key}_${suffix}`;
    }
    static async remove(key, groupedByUser = true, suffix = "") {
        const suffixKey = this.suffix(key, suffix);
        const storageKey = groupedByUser ? await Storage.prefix(suffixKey) : suffixKey;
        await async_storage_1.default.removeItem(storageKey);
    }
    static async prefix(key) {
        const user = await this.getIdentity();
        return `${user.id}_${key}`;
    }
    static async logOpening() {
        console.log("Logging Opening");
        const openings = parseInt(await this.get(Key.OPENINGS, true));
        if (openings == null || isNaN(openings)) {
            await this.set(Key.OPENINGS, "1", true);
        }
        else {
            await this.set(Key.OPENINGS, (openings + 1).toString(), true);
        }
        await this.set(Key.LAST_OPENED, new Date().getTime().toString(), true);
    }
    static async getLastOpened() {
        const lastOpened = parseInt(await this.get(Key.LAST_OPENED, true));
        return lastOpened;
    }
    static async getOpenings() {
        const openings = parseInt(await this.get(Key.OPENINGS, true));
        return openings;
    }
    static async getIdentity() {
        const userJson = await async_storage_1.default.getItem(Key.USER);
        const user = userJson != null ? JSON.parse(userJson) : null;
        return user;
    }
    static async setIdentity(user) {
        const userJson = JSON.stringify(user);
        await async_storage_1.default.setItem(Key.USER, userJson);
    }
}
exports.default = Storage;
