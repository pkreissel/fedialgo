import FeatureScorer from '../FeatureScorer'
import { StatusType } from '../../types'
import { mastodon } from 'masto'
import FeatureStorage from '../../features/FeatureStore'

export default class favsFeatureScorer extends FeatureScorer {

    constructor() {
        super({
            featureGetter: (api: mastodon.rest.Client) => FeatureStorage.getTopFavs(api),
            verboseName: "Favs",
            description: "Posts that are from your most favorited users",
            defaultWeight: 1,
        })
    }

    async score(_api: mastodon.rest.Client, status: StatusType) {
        return (status.account.acct in this.feature) ? this.feature[status.account.acct] : 0
    }
}