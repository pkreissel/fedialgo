"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FeatureScorer_1 = __importDefault(require("../FeatureScorer"));
const FeatureStore_1 = __importDefault(require("../../features/FeatureStore"));
class reblogsFeatureScorer extends FeatureScorer_1.default {
    constructor() {
        super({
            featureGetter: (api) => { return FeatureStore_1.default.getTopReblogs(api); },
            verboseName: "Reblogs",
            description: "Posts that are from your most reblogger users",
            defaultWeight: 3,
        });
    }
    async score(api, status) {
        const authorScore = (status.account.acct in this.feature) ? this.feature[status.account.acct] : 0;
        const reblogScore = (status.reblog && status.reblog.account.acct in this.feature) ? this.feature[status.reblog.account.acct] : 0;
        return authorScore + reblogScore;
    }
}
exports.default = reblogsFeatureScorer;
