import FeatureScorer from '../FeatureScorer';
import { StatusType, accFeatureType } from "../../types";
import { mastodon } from "masto";
import FeatureStorage from "../../features/FeatureStore";

export default class topPostFeatureScorer extends FeatureScorer {
    constructor() {
        super({
            featureGetter: (api: mastodon.Client) => { return Promise.resolve({}) },
            verboseName: "TopPosts",
            description: "Posts that are trending on multiple of your most popular instances",
            defaultWeight: 1,
        })
    }

    async score(api: mastodon.Client, status: StatusType) {
        return status.topPost ? 1 : 0
    }
}