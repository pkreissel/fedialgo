import FeatureScorer from '../FeatureScorer'
import { StatusType, accFeatureType } from '../../types'
import { mastodon } from 'masto'
import Storage from '../../Storage'

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
        const lastOpened = await Storage.getLastOpened() || 0
        const percent = (Date.now() - lastOpened) < (1000 * 60 * 60 * 6) ? 0.5 : 0.9
        return Math.random() > 0.9 ? 1 : 0
    }
}