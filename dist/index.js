"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const scorer_1 = require("./scorer");
const weightsStore_1 = __importDefault(require("./weights/weightsStore"));
const homeFeed_1 = __importDefault(require("./feeds/homeFeed"));
const topPostsFeed_1 = __importDefault(require("./feeds/topPostsFeed"));
const Storage_1 = __importDefault(require("./Storage"));
const Paginator_1 = __importDefault(require("./Paginator"));
const chaosFeatureScorer_1 = __importDefault(require("./scorer/feature/chaosFeatureScorer"));
class TheAlgorithm {
    user;
    fetchers = [homeFeed_1.default, topPostsFeed_1.default];
    featureScorer = [new scorer_1.favsFeatureScorer(), new scorer_1.reblogsFeatureScorer(), new scorer_1.interactsFeatureScorer(), new scorer_1.topPostFeatureScorer(), new chaosFeatureScorer_1.default()];
    feedScorer = [new scorer_1.reblogsFeedScorer(), new scorer_1.diversityFeedScorer()];
    feed = [];
    api;
    constructor(api, user, valueCalculator = null) {
        this.api = api;
        this.user = user;
        Storage_1.default.setIdentity(user);
        Storage_1.default.logOpening();
        if (valueCalculator) {
            this._getValueFromScores = valueCalculator;
        }
        this.setDefaultWeights();
    }
    async getFeedAdvanced(fetchers, featureScorer, feedScorer) {
        this.fetchers = fetchers;
        this.featureScorer = featureScorer;
        this.feedScorer = feedScorer;
        return this.getFeed();
    }
    async getFeed() {
        const { fetchers, featureScorer, feedScorer } = this;
        const response = await Promise.all(fetchers.map(fetcher => fetcher(this.api, this.user)));
        this.feed = response.flat();
        // Load and Prepare Features
        await Promise.all(featureScorer.map(scorer => scorer.getFeature(this.api)));
        await Promise.all(feedScorer.map(scorer => scorer.setFeed(this.feed)));
        // Get Score Names
        const scoreNames = featureScorer.map(scorer => scorer.getVerboseName());
        const feedScoreNames = feedScorer.map(scorer => scorer.getVerboseName());
        // Score Feed
        let scoredFeed = [];
        for (const status of this.feed) {
            // Load Scores for each status
            const featureScore = await Promise.all(featureScorer.map(scorer => scorer.score(this.api, status)));
            const feedScore = await Promise.all(feedScorer.map(scorer => scorer.score(status)));
            // Turn Scores into Weight Objects
            const featureScoreObj = this._getScoreObj(scoreNames, featureScore);
            const feedScoreObj = this._getScoreObj(feedScoreNames, feedScore);
            const scoreObj = { ...featureScoreObj, ...feedScoreObj };
            // Add Weight Object to Status
            status["scores"] = scoreObj;
            status["value"] = await this._getValueFromScores(scoreObj);
            scoredFeed.push(status);
        }
        // Remove Replies, Stuff Already Retweeted, and Nulls
        scoredFeed = scoredFeed
            .filter((item) => item != undefined)
            .filter((item) => item.inReplyToId === null)
            .filter((item) => item.content.includes("RT @") === false)
            .filter((item) => !(item?.reblog?.reblogged ?? false))
            .filter((item) => (!item?.reblog?.muted ?? true));
        // Add Time Penalty
        scoredFeed = scoredFeed.map((item) => {
            const seconds = Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / 1000);
            const timediscount = Math.pow((1 + 0.7 * 0.2), -Math.pow((seconds / 3600), 2));
            item.value = (item.value ?? 0) * timediscount;
            return item;
        });
        // Sort Feed
        scoredFeed = scoredFeed.sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
        //Remove duplicates
        scoredFeed = [...new Map(scoredFeed.map((item) => [item["uri"], item])).values()];
        this.feed = scoredFeed;
        return this.feed;
    }
    _getScoreObj(scoreNames, scores) {
        return scoreNames.reduce((obj, cur, i) => {
            obj[cur] = scores[i];
            return obj;
        }, {});
    }
    async _getValueFromScores(scores) {
        const weights = await weightsStore_1.default.getWeightsMulti(Object.keys(scores));
        const weightedScores = Object.keys(scores).reduce((obj, cur) => {
            obj = obj + (scores[cur] * weights[cur] ?? 0);
            return obj;
        }, 0);
        return weightedScores;
    }
    getWeightNames() {
        const scorers = [...this.featureScorer, ...this.feedScorer];
        return [...scorers.map(scorer => scorer.getVerboseName())];
    }
    async setDefaultWeights() {
        //Set Default Weights if they don't exist
        const scorers = [...this.featureScorer, ...this.feedScorer];
        Promise.all(scorers.map(scorer => weightsStore_1.default.defaultFallback(scorer.getVerboseName(), scorer.getDefaultWeight())));
    }
    getWeightDescriptions() {
        const scorers = [...this.featureScorer, ...this.feedScorer];
        return [...scorers.map(scorer => scorer.getDescription())];
    }
    async getWeights() {
        const verboseNames = this.getWeightNames();
        const weights = await weightsStore_1.default.getWeightsMulti(verboseNames);
        return weights;
    }
    async setWeights(weights) {
        //prevent weights from being set to 0
        for (const key in weights) {
            if (weights[key] == undefined || weights[key] == null || isNaN(weights[key])) {
                console.log("Weights not set because of error");
                return this.feed;
            }
        }
        await weightsStore_1.default.setWeightsMulti(weights);
        const scoredFeed = [];
        for (const status of this.feed) {
            if (!status["scores"]) {
                return this.getFeed();
            }
            status["value"] = await this._getValueFromScores(status["scores"]);
            scoredFeed.push(status);
        }
        this.feed = scoredFeed.sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
        return this.feed;
    }
    getDescription(verboseName) {
        const scorers = [...this.featureScorer, ...this.feedScorer];
        const scorer = scorers.find(scorer => scorer.getVerboseName() === verboseName);
        if (scorer) {
            return scorer.getDescription();
        }
        return "";
    }
    async weightAdjust(statusWeights, step = 0.001) {
        //Adjust Weights based on user interaction
        if (statusWeights == undefined)
            return;
        const mean = Object.values(statusWeights).filter((value) => !isNaN(value)).reduce((accumulator, currentValue) => accumulator + Math.abs(currentValue), 0) / Object.values(statusWeights).length;
        const currentWeight = await this.getWeights();
        const currentMean = Object.values(currentWeight).filter((value) => !isNaN(value)).reduce((accumulator, currentValue) => accumulator + currentValue, 0) / Object.values(currentWeight).length;
        for (let key in currentWeight) {
            let reweight = 1 - (Math.abs(statusWeights[key]) / mean) / (currentWeight[key] / currentMean);
            currentWeight[key] = currentWeight[key] - step * currentWeight[key] * reweight;
        }
        await this.setWeights(currentWeight);
        return currentWeight;
    }
    list() {
        return new Paginator_1.default(this.feed);
    }
}
exports.default = TheAlgorithm;
