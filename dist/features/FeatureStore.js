"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const favsFeature_1 = __importDefault(require("./favsFeature"));
const reblogsFeature_1 = __importDefault(require("./reblogsFeature"));
const interactsFeature_1 = __importDefault(require("./interactsFeature"));
const coreServerFeature_1 = __importDefault(require("./coreServerFeature"));
const Storage_1 = __importStar(require("../Storage"));
class FeatureStorage extends Storage_1.default {
    static async getTopFavs(api) {
        const topFavs = await this.get(Storage_1.Key.TOP_FAVS);
        console.log(topFavs);
        if (topFavs != null && await this.getOpenings() % 10 < 9) {
            return topFavs;
        }
        else {
            const favs = await (0, favsFeature_1.default)(api);
            await this.set(Storage_1.Key.TOP_FAVS, favs);
            return favs;
        }
    }
    static async getTopReblogs(api) {
        const topReblogs = await this.get(Storage_1.Key.TOP_REBLOGS);
        console.log(topReblogs);
        if (topReblogs != null && await this.getOpenings() % 10 < 9) {
            return topReblogs;
        }
        else {
            const reblogs = await (0, reblogsFeature_1.default)(api);
            await this.set(Storage_1.Key.TOP_REBLOGS, reblogs);
            return reblogs;
        }
    }
    static async getTopInteracts(api) {
        const topInteracts = await this.get(Storage_1.Key.TOP_INTERACTS);
        console.log(topInteracts);
        if (topInteracts != null && await this.getOpenings() % 10 < 9) {
            return topInteracts;
        }
        else {
            const interacts = await (0, interactsFeature_1.default)(api);
            await this.set(Storage_1.Key.TOP_INTERACTS, interacts);
            return interacts;
        }
    }
    static async getCoreServer(api) {
        const coreServer = await this.get(Storage_1.Key.CORE_SERVER);
        console.log(coreServer);
        if (coreServer != null && await this.getOpenings() % 10 != 9) {
            return coreServer;
        }
        else {
            const user = await this.getIdentity();
            const server = await (0, coreServerFeature_1.default)(api, user);
            await this.set(Storage_1.Key.CORE_SERVER, server);
            return server;
        }
    }
}
exports.default = FeatureStorage;
