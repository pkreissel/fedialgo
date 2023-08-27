"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FeedScorer {
    _verboseName = "BaseScorer";
    _isReady = false;
    _description = "";
    _defaultWeight = 1;
    features = {};
    constructor(verboseName, description, defaultWeight) {
        this._verboseName = verboseName;
        this._description = description || "";
        this._defaultWeight = defaultWeight || 1;
    }
    async setFeed(feed) {
        this.features = await this.feedExtractor(feed);
        this._isReady = true;
    }
    feedExtractor(feed) {
        throw new Error("Method not implemented.");
    }
    async score(status) {
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
exports.default = FeedScorer;
