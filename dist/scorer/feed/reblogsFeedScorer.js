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
class reblogsFeedScorer extends FeedScorer_1.default {
    constructor() {
        super("reblogsFeed");
    }
    feedExtractor(feed) {
        return feed.reduce((obj, status) => {
            if (status.reblog) {
                obj[status.reblog.uri] = (obj[status.reblog.uri] || 0) + 1;
            }
            else {
                obj[status.uri] = (obj[status.uri] || 0) + 1;
            }
            return obj;
        }, {});
    }
    score(status) {
        const _super = Object.create(null, {
            score: { get: () => super.score }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.score.call(this, status);
            const features = this.features;
            if (status.reblog) {
                return features[status.reblog.uri] || 0;
            }
            return 0;
        });
    }
}
exports.default = reblogsFeedScorer;
