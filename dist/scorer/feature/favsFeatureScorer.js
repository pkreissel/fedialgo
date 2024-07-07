"use strict";
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
    async score(_api, status) {
        return (status.account.acct in this.feature) ? this.feature[status.account.acct] : 0;
    }
}
exports.default = favsFeatureScorer;
