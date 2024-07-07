import { mastodon } from "masto";
import { accFeatureType, StatusType } from "../types";
interface RankParams {
    featureGetter: (api: mastodon.rest.Client) => Promise<accFeatureType>;
    verboseName: string;
    description?: string;
    defaultWeight?: number;
}
export default class FeatureScorer {
    featureGetter: (api: mastodon.rest.Client) => Promise<accFeatureType>;
    private _verboseName;
    private _isReady;
    private _description;
    feature: accFeatureType;
    private _defaultWeight;
    constructor(params: RankParams);
    getFeature(api: mastodon.rest.Client): Promise<void>;
    score(_api: mastodon.rest.Client, _status: StatusType): Promise<number>;
    getVerboseName(): string;
    getDescription(): string;
    getDefaultWeight(): number;
}
export {};
