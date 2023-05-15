import FeatureScorer from "../FeatureScorer";
import { StatusType, accFeatureType } from "../../types";
import { mastodon } from "masto";
import FeatureStorage from "../../features/FeatureStore";

export default class reblogsFeatureScorer extends FeatureScorer {
    constructor() {
        super({
            featureGetter: (api: mastodon.Client) => { return FeatureStorage.getTopReblogs(api) },
            verboseName: "Reblogs",
            description: "Posts that are from your most reblogger users"
        })
    }

    async score(api: mastodon.Client, status: StatusType) {
        const authorScore = (status.account.acct in this.feature) ? this.feature[status.account.acct] : 0
        const reblogScore = (status.reblog && status.reblog.account.acct in this.feature) ? this.feature[status.reblog.account.acct] : 0
        return authorScore + reblogScore
    }
}