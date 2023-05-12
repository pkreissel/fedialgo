import { mastodon } from "masto"
import { StatusType, accFeatureType } from "../types";

interface RankParams {
    featureGetter: (api: mastodon.Client) => Promise<accFeatureType>,
    verboseName: string,
}


export default class FeatureScorer {
    featureGetter: (api: mastodon.Client) => Promise<accFeatureType>;
    private _verboseName: string;
    private _isReady: boolean = false;
    feature: accFeatureType = {};
    defaultWeight: number = 1;

    constructor(params: RankParams) {
        this.featureGetter = params.featureGetter;
        this._verboseName = params.verboseName;
    }

    async getFeature(api: mastodon.Client) {
        this._isReady = true;
        this.feature = await this.featureGetter(api);
    }

    async score(api: mastodon.Client, status: StatusType): Promise<number> {
        if (!this._isReady) {
            await this.getFeature(api);
            this._isReady = true;
        }
        return 0
    }

    get verboseName() {
        return this._verboseName;
    }
}