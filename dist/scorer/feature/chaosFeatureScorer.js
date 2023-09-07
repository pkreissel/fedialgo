"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FeatureScorer_1 = __importDefault(require("../FeatureScorer"));
class chaosFeatureScorer extends FeatureScorer_1.default {
    constructor() {
        super({
            featureGetter: (async (api) => { return {}; }),
            verboseName: "Chaos",
            description: "Insert Randomness and Chaos into the feed - because its fair",
            defaultWeight: 1,
        });
    }
    async score(api, status) {
        return Math.random() > 0.9 ? 1 : 0;
    }
}
exports.default = chaosFeatureScorer;
