import { mastodon } from "masto";
import { FeedFetcher, StatusType, weightsType } from "./types";
import { favsFeatureScorer, interactsFeatureScorer, reblogsFeatureScorer, diversityFeedScorer, reblogsFeedScorer, FeatureScorer, FeedScorer, topPostFeatureScorer } from "./scorer";
import getHomeFeed from "./feeds/homeFeed";
import Paginator from "./Paginator";
import chaosFeatureScorer from "./scorer/feature/chaosFeatureScorer";
export default class TheAlgorithm {
    user: mastodon.v1.Account;
    fetchers: (typeof getHomeFeed)[];
    featureScorer: (favsFeatureScorer | interactsFeatureScorer | reblogsFeatureScorer | topPostFeatureScorer | chaosFeatureScorer)[];
    feedScorer: (diversityFeedScorer | reblogsFeedScorer)[];
    feed: StatusType[];
    api: mastodon.rest.Client;
    constructor(api: mastodon.rest.Client, user: mastodon.v1.Account, valueCalculator?: (((scores: weightsType) => Promise<number>) | null));
    getFeedAdvanced(fetchers: Array<FeedFetcher>, featureScorer: Array<FeatureScorer>, feedScorer: Array<FeedScorer>): Promise<StatusType[]>;
    getFeed(): Promise<StatusType[]>;
    private _getScoreObj;
    private _getValueFromScores;
    getWeightNames(): string[];
    setDefaultWeights(): Promise<void>;
    getWeightDescriptions(): string[];
    getWeights(): Promise<weightsType>;
    setWeights(weights: weightsType): Promise<StatusType[]>;
    getDescription(verboseName: string): string;
    weightAdjust(statusWeights: weightsType, step?: number): Promise<weightsType | undefined>;
    list(): Paginator;
}
