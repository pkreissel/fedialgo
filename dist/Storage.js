"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
})(Key = exports.Key || (exports.Key = {}));
class Storage {
    static get(key, groupedByUser = true, suffix = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const suffixKey = this.suffix(key, suffix);
            const storageKey = groupedByUser ? yield this.prefix(suffixKey) : suffixKey;
            const jsonValue = yield async_storage_1.default.getItem(storageKey);
            const value = jsonValue != null ? JSON.parse(jsonValue) : null;
            return value != null ? value[storageKey] : null;
        });
    }
    static set(key, value, groupedByUser = true, suffix = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const suffixKey = this.suffix(key, suffix);
            const storageKey = groupedByUser ? yield this.prefix(suffixKey) : suffixKey;
            const jsonValue = JSON.stringify({ [storageKey]: value });
            yield async_storage_1.default.setItem(storageKey, jsonValue);
        });
    }
    static suffix(key, suffix) {
        if (suffix === "")
            return key;
        return `${key}_${suffix}`;
    }
    static remove(key, groupedByUser = true, suffix = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const suffixKey = this.suffix(key, suffix);
            const storageKey = groupedByUser ? yield Storage.prefix(suffixKey) : suffixKey;
            yield async_storage_1.default.removeItem(storageKey);
        });
    }
    static prefix(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getIdentity();
            return `${user.id}_${key}`;
        });
    }
    static getIdentity() {
        return __awaiter(this, void 0, void 0, function* () {
            const userJson = yield async_storage_1.default.getItem(Key.USER);
            const user = userJson != null ? JSON.parse(userJson) : null;
            return user;
        });
    }
    static setIdentity(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const userJson = JSON.stringify(user);
            yield async_storage_1.default.setItem(Key.USER, userJson);
        });
    }
}
exports.default = Storage;
