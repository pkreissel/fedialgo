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
class FeatureScorer {
    constructor(params) {
        this._isReady = false;
        this._description = "";
        this.feature = {};
        this.defaultWeight = 1;
        this.featureGetter = params.featureGetter;
        this._verboseName = params.verboseName;
        this._description = params.description || "";
    }
    getFeature(api) {
        return __awaiter(this, void 0, void 0, function* () {
            this._isReady = true;
            this.feature = yield this.featureGetter(api);
        });
    }
    score(api, status) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._isReady) {
                yield this.getFeature(api);
                this._isReady = true;
            }
            return 0;
        });
    }
    getVerboseName() {
        return this._verboseName;
    }
    getDescription() {
        return this._description;
    }
}
exports.default = FeatureScorer;
