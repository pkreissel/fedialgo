import FeatureScorer from '../FeatureScorer'

export default class chaosFeatureScorer extends FeatureScorer {
    constructor() {
        super({
            featureGetter: (async () => { return {} }),
            verboseName: "Chaos",
            description: "Insert Randomness and Chaos into the feed - because its fair",
            defaultWeight: 1,
        })
    }
    async score() {
        return Math.random() > 0.9 ? 1 : 0
    }
}