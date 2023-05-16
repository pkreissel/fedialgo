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
const scorer_1 = require("./scorer");
const weightsStore_1 = __importDefault(require("./weights/weightsStore"));
const homeFeed_1 = __importDefault(require("./feeds/homeFeed"));
const topPostsFeed_1 = __importDefault(require("./feeds/topPostsFeed"));
const Storage_1 = __importDefault(require("./Storage"));
class TheAlgorithm {
    constructor(api, user, valueCalculator = null) {
        this.fetchers = [homeFeed_1.default, topPostsFeed_1.default];
        this.featureScorer = [new scorer_1.favsFeatureScorer(), new scorer_1.reblogsFeatureScorer(), new scorer_1.interactsFeatureScorer(), new scorer_1.topPostFeatureScorer()];
        this.feedScorer = [new scorer_1.reblogsFeedScorer(), new scorer_1.diversityFeedScorer()];
        this.feed = [];
        this.api = api;
        this.user = user;
        Storage_1.default.setIdentity(user);
        if (valueCalculator) {
            this._getValueFromScores = valueCalculator;
        }
        this.setDefaultWeights();
    }
    getFeedAdvanced(fetchers, featureScorer, feedScorer) {
        return __awaiter(this, void 0, void 0, function* () {
            this.fetchers = fetchers;
            this.featureScorer = featureScorer;
            this.feedScorer = feedScorer;
            return this.getFeed();
        });
    }
    getFeed() {
        return __awaiter(this, void 0, void 0, function* () {
            const { fetchers, featureScorer, feedScorer } = this;
            const response = yield Promise.all(fetchers.map(fetcher => fetcher(this.api, this.user)));
            this.feed = response.flat();
            // Load and Prepare Features
            yield Promise.all(featureScorer.map(scorer => scorer.getFeature(this.api)));
            yield Promise.all(feedScorer.map(scorer => scorer.setFeed(this.feed)));
            // Get Score Names
            const scoreNames = featureScorer.map(scorer => scorer.getVerboseName());
            const feedScoreNames = feedScorer.map(scorer => scorer.getVerboseName());
            // Score Feed
            let scoredFeed = [];
            for (const status of this.feed) {
                // Load Scores for each status
                const featureScore = yield Promise.all(featureScorer.map(scorer => scorer.score(this.api, status)));
                const feedScore = yield Promise.all(feedScorer.map(scorer => scorer.score(status)));
                // Turn Scores into Weight Objects
                const featureScoreObj = this._getScoreObj(scoreNames, featureScore);
                const feedScoreObj = this._getScoreObj(feedScoreNames, feedScore);
                const scoreObj = Object.assign(Object.assign({}, featureScoreObj), feedScoreObj);
                // Add Weight Object to Status
                status["scores"] = scoreObj;
                status["value"] = yield this._getValueFromScores(scoreObj);
                scoredFeed.push(status);
            }
            // Remove Replies, Stuff Already Retweeted, and Nulls
            scoredFeed = scoredFeed
                .filter((item) => item != undefined)
                .filter((item) => item.inReplyToId === null)
                .filter((item) => item.content.includes("RT @") === false)
                .filter((item) => !item.reblogged);
            // Add Time Penalty
            scoredFeed = scoredFeed.map((item) => {
                var _a;
                const seconds = Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / 1000);
                const timediscount = Math.pow((1 + 0.7 * 0.2), -Math.pow((seconds / 3600), 2));
                item.value = ((_a = item.value) !== null && _a !== void 0 ? _a : 0) * timediscount;
                return item;
            });
            // Sort Feed
            scoredFeed = scoredFeed.sort((a, b) => { var _a, _b; return ((_a = b.value) !== null && _a !== void 0 ? _a : 0) - ((_b = a.value) !== null && _b !== void 0 ? _b : 0); });
            //Remove duplicates
            scoredFeed = [...new Map(scoredFeed.map((item) => [item["uri"], item])).values()];
            this.feed = scoredFeed;
            console.log(this.feed);
            return this.feed;
        });
    }
    _getScoreObj(scoreNames, scores) {
        return scoreNames.reduce((obj, cur, i) => {
            obj[cur] = scores[i];
            return obj;
        }, {});
    }
    _getValueFromScores(scores) {
        return __awaiter(this, void 0, void 0, function* () {
            const weights = yield weightsStore_1.default.getWeightsMulti(Object.keys(scores));
            const weightedScores = Object.keys(scores).reduce((obj, cur) => {
                var _a;
                obj = obj + ((_a = scores[cur] * weights[cur]) !== null && _a !== void 0 ? _a : 0);
                return obj;
            }, 0);
            return weightedScores;
        });
    }
    getWeightNames() {
        const scorers = [...this.featureScorer, ...this.feedScorer];
        return [...scorers.map(scorer => scorer.getVerboseName())];
    }
    setDefaultWeights() {
        return __awaiter(this, void 0, void 0, function* () {
            //Set Default Weights if they don't exist
            const scorers = [...this.featureScorer, ...this.feedScorer];
            Promise.all(scorers.map(scorer => weightsStore_1.default.defaultFallback(scorer.getVerboseName(), scorer.getDefaultWeight())));
        });
    }
    getWeightDescriptions() {
        const scorers = [...this.featureScorer, ...this.feedScorer];
        return [...scorers.map(scorer => scorer.getDescription())];
    }
    getWeights() {
        return __awaiter(this, void 0, void 0, function* () {
            const verboseNames = this.getWeightNames();
            const weights = yield weightsStore_1.default.getWeightsMulti(verboseNames);
            return weights;
        });
    }
    setWeights(weights) {
        return __awaiter(this, void 0, void 0, function* () {
            yield weightsStore_1.default.setWeightsMulti(weights);
            const scoredFeed = [];
            for (const status of this.feed) {
                if (!status["scores"]) {
                    return this.getFeed();
                }
                status["value"] = yield this._getValueFromScores(status["scores"]);
                scoredFeed.push(status);
            }
            this.feed = scoredFeed.sort((a, b) => { var _a, _b; return ((_a = b.value) !== null && _a !== void 0 ? _a : 0) - ((_b = a.value) !== null && _b !== void 0 ? _b : 0); });
            return this.feed;
        });
    }
    getDescription(verboseName) {
        return __awaiter(this, void 0, void 0, function* () {
            const scorers = [...this.featureScorer, ...this.feedScorer];
            const scorer = scorers.find(scorer => scorer.getVerboseName() === verboseName);
            if (scorer) {
                return scorer.getDescription();
            }
            return "";
        });
    }
    weightAdjust(statusWeights) {
        return __awaiter(this, void 0, void 0, function* () {
            //Adjust Weights based on user interaction
            if (statusWeights == undefined)
                return;
            const mean = Object.values(statusWeights).reduce((accumulator, currentValue) => accumulator + Math.abs(currentValue), 0) / Object.values(statusWeights).length;
            const currentWeight = yield this.getWeights();
            const currentMean = Object.values(currentWeight).reduce((accumulator, currentValue) => accumulator + currentValue, 0) / Object.values(currentWeight).length;
            for (let key in currentWeight) {
                currentWeight[key] = currentWeight[key] + 0.1 * currentWeight[key] * (Math.abs(statusWeights[key]) / mean) / (currentWeight[key] / currentMean);
            }
            yield this.setWeights(currentWeight);
            return currentWeight;
        });
    }
}
exports.default = TheAlgorithm;
