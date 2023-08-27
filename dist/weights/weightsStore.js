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
Object.defineProperty(exports, "__esModule", { value: true });
const Storage_1 = __importStar(require("../Storage"));
class weightsStore extends Storage_1.default {
    static async getWeight(verboseName) {
        const weight = await this.get(Storage_1.Key.WEIGHTS, true, verboseName);
        if (weight != null) {
            return weight;
        }
        return { [verboseName]: 1 };
    }
    static async setWeights(weights, verboseName) {
        await this.set(Storage_1.Key.WEIGHTS, weights, true, verboseName);
    }
    static async getWeightsMulti(verboseNames) {
        const weights = {};
        for (const verboseName of verboseNames) {
            const weight = await this.getWeight(verboseName);
            weights[verboseName] = weight[verboseName];
        }
        return weights;
    }
    static async setWeightsMulti(weights) {
        for (const verboseName in weights) {
            await this.setWeights({ [verboseName]: weights[verboseName] }, verboseName);
        }
    }
    static async defaultFallback(verboseName, defaultWeight) {
        // If the weight is not set, set it to the default weight
        const weight = await this.get(Storage_1.Key.WEIGHTS, true, verboseName);
        if (weight == null) {
            await this.setWeights({ [verboseName]: defaultWeight }, verboseName);
            return true;
        }
        return false;
    }
}
exports.default = weightsStore;
