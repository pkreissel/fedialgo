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
const FeatureScorer_1 = __importDefault(require("../FeatureScorer"));
const FeatureStore_1 = __importDefault(require("../../features/FeatureStore"));
class favsFeatureScorer extends FeatureScorer_1.default {
    constructor() {
        super({
            featureGetter: (api) => FeatureStore_1.default.getTopFavs(api),
            verboseName: "Favs",
            description: "Posts that are from your most favorited users",
            defaultWeight: 1,
        });
    }
    score(api, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return (status.account.acct in this.feature) ? this.feature[status.account.acct] : 0;
        });
    }
}
exports.default = favsFeatureScorer;
