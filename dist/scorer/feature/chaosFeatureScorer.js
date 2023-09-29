"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FeatureScorer_1 = __importDefault(require("../FeatureScorer"));
const Storage_1 = __importDefault(require("../../Storage"));
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
        if (status.topPost)
            return 0;
        const lastOpened = await Storage_1.default.getLastOpened() || 0;
        const percent = (Date.now() - lastOpened) < (1000 * 60 * 60 * 6) ? 0.5 : 0.9;
        return Math.random() > 0.9 ? 1 : 0;
    }
}
exports.default = chaosFeatureScorer;
