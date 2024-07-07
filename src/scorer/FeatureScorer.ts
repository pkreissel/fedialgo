import { mastodon } from "masto"
import { accFeatureType, StatusType } from "../types";

interface RankParams {
    featureGetter: (api: mastodon.rest.Client) => Promise<accFeatureType>,
    verboseName: string,
    description?: string,
    defaultWeight?: number,
}


export default class FeatureScorer {
    featureGetter: (api: mastodon.rest.Client) => Promise<accFeatureType>;
    private _verboseName: string;
    private _isReady: boolean = false;
    private _description: string = "";
    feature: accFeatureType = {};
    private _defaultWeight: number = 1;

    constructor(params: RankParams) {
        this.featureGetter = params.featureGetter;
        this._verboseName = params.verboseName;
        this._description = params.description || "";
        this._defaultWeight = params.defaultWeight || 1;
    }

    async getFeature(api: mastodon.rest.Client) {
        this._isReady = true;
        this.feature = await this.featureGetter(api);
    }

    async score(_api: mastodon.rest.Client, _status: StatusType): Promise<number> {
        return 0
    }

    getVerboseName() {
        return this._verboseName;
    }

    getDescription() {
        return this._description;
    }

    getDefaultWeight() {
        return this._defaultWeight;
    }
}