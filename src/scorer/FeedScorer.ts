import { mastodon } from "masto"
import { StatusType } from "../types";

export default class FeedScorer {
    private _verboseName: string = "BaseScorer";
    private _isReady: boolean = false;
    private _description: string = "";
    private _defaultWeight: number = 1;

    features: Record<string, number> = {};


    constructor(verboseName: string, description?: string, defaultWeight?: number) {
        this._verboseName = verboseName;
        this._description = description || "";
        this._defaultWeight = defaultWeight || 1;
    }

    async setFeed(feed: StatusType[]) {
        this.features = await this.feedExtractor(feed)
        this._isReady = true;
    }

    feedExtractor(_feed: StatusType[]): Record<string, number> {
        throw new Error("Method not implemented.");
    }

    async score(_status: mastodon.v1.Status): Promise<number> {
        if (!this._isReady) {
            throw new Error("FeedScorer not ready");
        }
        return 0;
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