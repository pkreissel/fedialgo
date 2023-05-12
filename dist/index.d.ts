import { mastodon } from "masto";
import { FeedFetcher, StatusType, weightsType } from "./types";
import { favsFeatureScorer, reblogsFeatureScorer, diversityFeedScorer, reblogsFeedScorer, FeatureScorer, FeedScorer } from "./scorer";
import getHomeFeed from "./feeds/homeFeed";
export default class TheAlgorithm {
    user: mastodon.v1.Account;
    fetchers: (typeof getHomeFeed)[];
    featureScorer: (favsFeatureScorer | reblogsFeatureScorer)[];
    feedScorer: (diversityFeedScorer | reblogsFeedScorer)[];
    feed: StatusType[];
    api: mastodon.Client;
    constructor(api: mastodon.Client, user: mastodon.v1.Account, valueCalculator?: (((scores: weightsType) => Promise<number>) | null));
    getFeedAdvanced(fetchers: Array<FeedFetcher>, featureScorer: Array<FeatureScorer>, feedScorer: Array<FeedScorer>): Promise<StatusType[]>;
    getFeed(): Promise<StatusType[]>;
    private _getScoreObj;
    private _getValueFromScores;
    getWeights(): Promise<weightsType>;
    setWeights(weights: weightsType): Promise<StatusType[]>;
}
