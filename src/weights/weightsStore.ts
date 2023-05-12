import { weightsType } from "../types";
import Storage, { Key } from "../Storage";

export default class weightsStore extends Storage {
    static async getWeight(verboseName: string) {
        const weight = await this.get(Key.WEIGHTS, true, verboseName) as weightsType;
        if (weight != null) {
            return weight;
        }
        return { [verboseName]: 1 };
    }

    static async setWeights(weights: weightsType, verboseName: string) {
        await this.set(Key.WEIGHTS, weights, true, verboseName);
    }

    static async getWeightsMulti(verboseNames: string[]) {
        const weights: weightsType = {}
        for (const verboseName of verboseNames) {
            const weight = await this.getWeight(verboseName);
            weights[verboseName] = weight[verboseName]
        }
        return weights;
    }

    static async setWeightsMulti(weights: weightsType) {
        for (const verboseName in weights) {
            await this.setWeights({ [verboseName]: weights[verboseName] }, verboseName);
        }
    }
}