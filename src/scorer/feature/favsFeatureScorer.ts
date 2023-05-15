import FeatureScorer from '../FeatureScorer'
import favsFeature from '../../features/favsFeature'
import { StatusType, accFeatureType } from '../../types'
import { mastodon } from 'masto'
import FeatureStorage from '../../features/FeatureStore'

export default class favsFeatureScorer extends FeatureScorer {
    constructor() {
        super({
            featureGetter: (api: mastodon.Client) => FeatureStorage.getTopFavs(api),
            verboseName: "Favs",
            description: "Posts that are from your most favorited users"
        })
    }

    async score(api: mastodon.Client, status: StatusType) {
        return (status.account.acct in this.feature) ? this.feature[status.account.acct] : 0
    }
}