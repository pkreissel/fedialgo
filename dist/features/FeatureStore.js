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
const favsFeature_1 = __importDefault(require("./favsFeature"));
const reblogsFeature_1 = __importDefault(require("./reblogsFeature"));
const interactsFeature_1 = __importDefault(require("./interactsFeature"));
const coreServerFeature_1 = __importDefault(require("./coreServerFeature"));
const Storage_1 = __importStar(require("../Storage"));
class FeatureStorage extends Storage_1.default {
    static getTopFavs(api) {
        return __awaiter(this, void 0, void 0, function* () {
            const topFavs = yield this.get(Storage_1.Key.TOP_FAVS);
            console.log(topFavs);
            if (topFavs != null) {
                return topFavs;
            }
            else {
                const favs = yield (0, favsFeature_1.default)(api);
                yield this.set(Storage_1.Key.TOP_FAVS, favs);
                return favs;
            }
        });
    }
    static getTopReblogs(api) {
        return __awaiter(this, void 0, void 0, function* () {
            const topReblogs = yield this.get(Storage_1.Key.TOP_REBLOGS);
            console.log(topReblogs);
            if (topReblogs != null) {
                return topReblogs;
            }
            else {
                const reblogs = yield (0, reblogsFeature_1.default)(api);
                yield this.set(Storage_1.Key.TOP_REBLOGS, reblogs);
                return reblogs;
            }
        });
    }
    static getTopInteracts(api) {
        return __awaiter(this, void 0, void 0, function* () {
            const topInteracts = yield this.get(Storage_1.Key.TOP_INTERACTS);
            console.log(topInteracts);
            if (topInteracts != null) {
                return topInteracts;
            }
            else {
                const interacts = yield (0, interactsFeature_1.default)(api);
                yield this.set(Storage_1.Key.TOP_INTERACTS, interacts);
                return interacts;
            }
        });
    }
    static getCoreServer(api) {
        return __awaiter(this, void 0, void 0, function* () {
            const coreServer = yield this.get(Storage_1.Key.CORE_SERVER);
            console.log(coreServer);
            if (coreServer != null) {
                return coreServer;
            }
            else {
                const user = yield this.getIdentity();
                const server = yield (0, coreServerFeature_1.default)(api, user);
                yield this.set(Storage_1.Key.CORE_SERVER, server);
                return server;
            }
        });
    }
}
exports.default = FeatureStorage;
