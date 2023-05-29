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
const masto_1 = require("masto");
const FeatureStore_1 = __importDefault(require("../features/FeatureStore"));
function getTopPostFeed(api) {
    return __awaiter(this, void 0, void 0, function* () {
        const core_servers = yield FeatureStore_1.default.getCoreServer(api);
        let results = [];
        const serializer = new masto_1.SerializerNativeImpl();
        //Get Top Servers
        const servers = Object.keys(core_servers).sort((a, b) => {
            return core_servers[b] - core_servers[a];
        }).slice(0, 10);
        results = yield Promise.all(servers.map((server) => __awaiter(this, void 0, void 0, function* () {
            if (server === "undefined" || typeof server == "undefined" || server === "")
                return [];
            let res;
            try {
                res = yield fetch("https://" + server + "/api/v1/trends/statuses");
            }
            catch (e) {
                return [];
            }
            if (!res.ok) {
                return [];
            }
            const data = serializer.deserialize('application/json', yield res.text());
            if (data === undefined) {
                return [];
            }
            return data.map((status) => {
                status.topPost = true;
                return status;
            }).slice(0, 10);
        })));
        console.log(results);
        return results.flat();
    });
}
exports.default = getTopPostFeed;
