"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FeedScorer_1 = __importDefault(require("../FeedScorer"));
class diversityFeedScorer extends FeedScorer_1.default {
    constructor() {
        super("Diversity", "Downranks posts from users that you have seen a lot of posts from");
    }
    feedExtractor(feed) {
        // this prevents just always the first post from being shown
        const sortRandom = () => Math.random() - 0.5;
        return feed.sort(sortRandom).reduce((obj, status) => {
            obj[status.account.acct] = (obj[status.account.acct] || 0) - 1;
            return obj;
        }, {});
    }
    async score(status) {
        super.score(status);
        const frequ = this.features[status.account.acct];
        this.features[status.account.acct] = frequ + 1;
        return frequ + 1;
    }
}
exports.default = diversityFeedScorer;
