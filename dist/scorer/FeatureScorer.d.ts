import { mastodon } from "masto";
import { StatusType, accFeatureType } from "../types";
interface RankParams {
    featureGetter: (api: mastodon.Client) => Promise<accFeatureType>;
    verboseName: string;
    description?: string;
    defaultWeight?: number;
}
export default class FeatureScorer {
    featureGetter: (api: mastodon.Client) => Promise<accFeatureType>;
    private _verboseName;
    private _isReady;
    private _description;
    feature: accFeatureType;
    private _defaultWeight;
    constructor(params: RankParams);
    getFeature(api: mastodon.Client): Promise<void>;
    score(api: mastodon.Client, status: StatusType): Promise<number>;
    getVerboseName(): string;
    getDescription(): string;
    getDefaultWeight(): number;
}
export {};
