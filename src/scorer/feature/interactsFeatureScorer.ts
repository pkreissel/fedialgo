import FeatureScorer from "../FeatureScorer";
import { StatusType, accFeatureType } from "../../types";
import { mastodon } from "masto";
import FeatureStorage from "../../features/FeatureStore";

export default class interactsFeatureScorer extends FeatureScorer {
    constructor() {
        super({
            featureGetter: (api: mastodon.Client) => { return FeatureStorage.getTopInteracts(api) },
            verboseName: "Interacts",
            description: "Posts that are from users, that often interact with your posts",
            defaultWeight: 2,
        })
    }

    async score(api: mastodon.Client, status: StatusType) {
        return (status.account.acct in this.feature) ? this.feature[status.account.acct] : 0
    }
}