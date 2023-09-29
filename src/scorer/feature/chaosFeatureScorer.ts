import FeatureScorer from '../FeatureScorer'
import { StatusType, accFeatureType } from '../../types'
import { mastodon } from 'masto'

export default class chaosFeatureScorer extends FeatureScorer {
    constructor() {
        super({
            featureGetter: (async (api: mastodon.rest.Client) => { return {} }),
            verboseName: "Chaos",
            description: "Insert Randomness and Chaos into the feed - because its fair",
            defaultWeight: 1,
        })
    }
    async score(api: mastodon.rest.Client, status: StatusType) {
        if (status.topPost) return 0
        return Math.random() > 0.9 ? 1 : 0
    }
}