"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const Storage_1 = __importStar(require("../Storage"));
class weightsStore extends Storage_1.default {
    static getWeight(verboseName) {
        return __awaiter(this, void 0, void 0, function* () {
            const weight = yield this.get(Storage_1.Key.WEIGHTS, true, verboseName);
            if (weight != null) {
                return weight;
            }
            return { [verboseName]: 1 };
        });
    }
    static setWeights(weights, verboseName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.set(Storage_1.Key.WEIGHTS, weights, true, verboseName);
        });
    }
    static getWeightsMulti(verboseNames) {
        return __awaiter(this, void 0, void 0, function* () {
            const weights = {};
            for (const verboseName of verboseNames) {
                const weight = yield this.getWeight(verboseName);
                weights[verboseName] = weight[verboseName];
            }
            return weights;
        });
    }
    static setWeightsMulti(weights) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const verboseName in weights) {
                yield this.setWeights({ [verboseName]: weights[verboseName] }, verboseName);
            }
        });
    }
    static defaultFallback(verboseName, defaultWeight) {
        return __awaiter(this, void 0, void 0, function* () {
            // If the weight is not set, set it to the default weight
            const weight = yield this.get(Storage_1.Key.WEIGHTS, true, verboseName);
            if (weight == null) {
                yield this.setWeights({ [verboseName]: defaultWeight }, verboseName);
                return true;
            }
            return false;
        });
    }
}
exports.default = weightsStore;
