"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FeedScorer_1 = __importDefault(require("../FeedScorer"));
class reblogsFeedScorer extends FeedScorer_1.default {
    constructor() {
        super("reblogsFeed", "More Weight to posts that are reblogged a lot", 6);
    }
    feedExtractor(feed) {
        // for each uri in the feed, count the number of times it appears
        const feedScorer = feed.reduce((obj, status) => {
            obj[status.uri] = (obj[status.uri] || 0) + 1;
            if (status.reblog) {
                obj[status.reblog.uri] = (obj[status.reblog.uri] || 0) + 1;
            }
            return obj;
        }, {});
        return feedScorer;
    }
    async score(status) {
        super.score(status);
        const features = this.features;
        if (status.reblog) {
            return features[status.reblog.uri] || 0;
        }
        return features[status.uri] || 0;
    }
}
exports.default = reblogsFeedScorer;
