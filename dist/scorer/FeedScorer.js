"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class FeedScorer {
    constructor(verboseName) {
        this._verboseName = "BaseScorer";
        this._isReady = false;
        this.features = {};
        this._verboseName = verboseName;
    }
    setFeed(feed) {
        return __awaiter(this, void 0, void 0, function* () {
            this.features = yield this.feedExtractor(feed);
            this._isReady = true;
        });
    }
    feedExtractor(feed) {
        throw new Error("Method not implemented.");
    }
    score(status) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._isReady) {
                throw new Error("FeedScorer not ready");
            }
            return 0;
        });
    }
    getVerboseName() {
        return this._verboseName;
    }
}
exports.default = FeedScorer;
