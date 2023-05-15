import { mastodon } from "masto"
import { StatusType } from "../types";

export default class FeedScorer {
    private _verboseName: string = "BaseScorer";
    private _isReady: boolean = false;
    private _description: string = "";
    features: any = {};


    constructor(verboseName: string, description?: string) {
        this._verboseName = verboseName;
        this._description = description || "";
    }

    async setFeed(feed: StatusType[]) {
        this.features = await this.feedExtractor(feed);
        this._isReady = true;
    }

    feedExtractor(feed: StatusType[]): any {
        throw new Error("Method not implemented.");
    }

    async score(status: mastodon.v1.Status) {
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
}