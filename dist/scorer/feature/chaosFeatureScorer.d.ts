import FeatureScorer from '../FeatureScorer';
export default class chaosFeatureScorer extends FeatureScorer {
    constructor();
    score(): Promise<0 | 1>;
}
