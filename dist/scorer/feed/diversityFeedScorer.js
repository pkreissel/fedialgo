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
const FeedScorer_1 = __importDefault(require("../FeedScorer"));
class diversityFeedScorer extends FeedScorer_1.default {
    constructor() {
        super("Diversity");
    }
    feedExtractor(feed) {
        return feed.reduce((obj, status) => {
            obj[status.account.acct] = (obj[status.account.acct] || 0) - 1;
            return obj;
        }, {});
    }
    score(status) {
        const _super = Object.create(null, {
            score: { get: () => super.score }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.score.call(this, status);
            const frequ = this.features[status.account.acct];
            this.features[status.account.acct] = frequ + 1;
            return frequ;
        });
    }
}
exports.default = diversityFeedScorer;
