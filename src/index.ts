import { mastodon } from "masto";
import { FeedFetcher, Scorer, StatusType, weightsType } from "./types";
import {
    favsFeatureScorer,
    interactsFeatureScorer,
    reblogsFeatureScorer,
    diversityFeedScorer,
    reblogsFeedScorer,
    FeatureScorer,
    FeedScorer,
    topPostFeatureScorer
} from "./scorer";
import weightsStore from "./weights/weightsStore";
import getHomeFeed from "./feeds/homeFeed";
import topPostsFeed from "./feeds/topPostsFeed";
import Storage from "./Storage";
import Paginator from "./Paginator"
import chaosFeatureScorer from "./scorer/feature/chaosFeatureScorer";

export default class TheAlgorithm {
    user: mastodon.v1.Account;
    fetchers = [getHomeFeed, topPostsFeed]
    featureScorer = [new favsFeatureScorer(), new reblogsFeatureScorer(), new interactsFeatureScorer(), new topPostFeatureScorer(), new chaosFeatureScorer()]
    feedScorer = [new reblogsFeedScorer(), new diversityFeedScorer()]
    feed: StatusType[] = [];
    api: mastodon.rest.Client;
    constructor(api: mastodon.rest.Client, user: mastodon.v1.Account, valueCalculator: (((scores: weightsType) => Promise<number>) | null) = null) {
        this.api = api;
        this.user = user;
        Storage.setIdentity(user);
        Storage.logOpening();
        if (valueCalculator) {
            this._getValueFromScores = valueCalculator;
        }
        this.setDefaultWeights();
    }

    async getFeedAdvanced(
        fetchers: Array<FeedFetcher>,
        featureScorer: Array<FeatureScorer>,
        feedScorer: Array<FeedScorer>
    ) {
        this.fetchers = fetchers;
        this.featureScorer = featureScorer;
        this.feedScorer = feedScorer;
        return this.getFeed();
    }

    async getFeed(): Promise<StatusType[]> {
        const { fetchers, featureScorer, feedScorer } = this;
        const response = await Promise.all(fetchers.map(fetcher => fetcher(this.api, this.user)))
        this.feed = response.flat();

        // Load and Prepare Features
        await Promise.all(featureScorer.map(scorer => scorer.getFeature(this.api)));
        await Promise.all(feedScorer.map(scorer => scorer.setFeed(this.feed)));

        // Get Score Names
        const scoreNames = featureScorer.map(scorer => scorer.getVerboseName());
        const feedScoreNames = feedScorer.map(scorer => scorer.getVerboseName());

        // Score Feed
        let scoredFeed: StatusType[] = []
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
            .filter((item: StatusType) => item != undefined)
            .filter((item: StatusType) => item.inReplyToId === null)
            .filter((item: StatusType) => item.content.includes("RT @") === false)
            .filter((item: StatusType) => !(item?.reblog?.reblogged ?? false))
            .filter((item: StatusType) => (!item?.reblog?.muted ?? true))


        // Add Time Penalty
        scoredFeed = scoredFeed.map((item: StatusType) => {
            const seconds = Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / 1000);
            const timediscount = Math.pow((1 + 0.7 * 0.2), - Math.pow((seconds / 3600), 2));
            item.value = (item.value ?? 0) * timediscount
            return item;
        })

        // Sort Feed
        scoredFeed = scoredFeed.sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

        //Remove duplicates
        scoredFeed = [...new Map(scoredFeed.map((item: StatusType) => [item["uri"], item])).values()];

        this.feed = scoredFeed
        return this.feed;
    }

    private _getScoreObj(scoreNames: string[], scores: number[]): weightsType {
        return scoreNames.reduce((obj: weightsType, cur, i) => {
            obj[cur] = scores[i];
            return obj;
        }, {});
    }

    private async _getValueFromScores(scores: weightsType): Promise<number> {
        const weights = await weightsStore.getWeightsMulti(Object.keys(scores));
        const weightedScores = Object.keys(scores).reduce((obj: number, cur) => {
            obj = obj + (scores[cur] * weights[cur] ?? 0)
            return obj;
        }, 0);
        return weightedScores;
    }

    getWeightNames(): string[] {
        const scorers = [...this.featureScorer, ...this.feedScorer];
        return [...scorers.map(scorer => scorer.getVerboseName())]
    }

    async setDefaultWeights(): Promise<void> {
        //Set Default Weights if they don't exist
        const scorers = [...this.featureScorer, ...this.feedScorer];
        Promise.all(scorers.map(scorer => weightsStore.defaultFallback(scorer.getVerboseName(), scorer.getDefaultWeight())))
    }

    getWeightDescriptions(): string[] {
        const scorers = [...this.featureScorer, ...this.feedScorer];
        return [...scorers.map(scorer => scorer.getDescription())]
    }

    async getWeights(): Promise<weightsType> {
        const verboseNames = this.getWeightNames();
        const weights = await weightsStore.getWeightsMulti(verboseNames);
        return weights;
    }

    async setWeights(weights: weightsType): Promise<StatusType[]> {
        //prevent weights from being set to 0
        for (const key in weights) {
            if (weights[key] == undefined || weights[key] == null || isNaN(weights[key])) {
                console.log("Weights not set because of error");
                return this.feed
            }
        }
        await weightsStore.setWeightsMulti(weights);
        const scoredFeed: StatusType[] = []
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

    getDescription(verboseName: string): string {
        const scorers = [...this.featureScorer, ...this.feedScorer];
        const scorer = scorers.find(scorer => scorer.getVerboseName() === verboseName);
        if (scorer) {
            return scorer.getDescription();
        }
        return "";
    }

    async weightAdjust(statusWeights: weightsType, step = 0.001): Promise<weightsType | undefined> {
        //Adjust Weights based on user interaction
        if (statusWeights == undefined) return;
        const mean = Object.values(statusWeights).filter((value: number) => !isNaN(value)).reduce((accumulator, currentValue) => accumulator + Math.abs(currentValue), 0) / Object.values(statusWeights).length;
        const currentWeight: weightsType = await this.getWeights()
        const currentMean = Object.values(currentWeight).filter((value: number) => !isNaN(value)).reduce((accumulator, currentValue) => accumulator + currentValue, 0) / Object.values(currentWeight).length;
        for (let key in currentWeight) {
            let reweight = 1 - (Math.abs(statusWeights[key]) / mean) / (currentWeight[key] / currentMean);
            currentWeight[key] = currentWeight[key] - step * currentWeight[key] * reweight;
        }
        await this.setWeights(currentWeight);
        return currentWeight;
    }

    list() {
        return new Paginator(this.feed)
    }
}