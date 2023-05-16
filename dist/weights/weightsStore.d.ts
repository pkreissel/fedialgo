import { weightsType } from "../types";
import Storage from "../Storage";
export default class weightsStore extends Storage {
    static getWeight(verboseName: string): Promise<weightsType>;
    static setWeights(weights: weightsType, verboseName: string): Promise<void>;
    static getWeightsMulti(verboseNames: string[]): Promise<weightsType>;
    static setWeightsMulti(weights: weightsType): Promise<void>;
    static defaultFallback(verboseName: string, defaultWeight: number): Promise<boolean>;
}
