import FeatureScorer from '../FeatureScorer';
import { StatusType, accFeatureType } from "../../types";
import { mastodon } from "masto";

export default class recommendedFeatureScorer extends FeatureScorer {
    constructor() {
        super({
            featureGetter: (api: mastodon.rest.Client) => { return Promise.resolve({}) },
            verboseName: "Recommended",
            description: "Posts that are recommended by AI embeddings",
            defaultWeight: 1,
        })
    }

    async score(api: mastodon.rest.Client, status: StatusType) {
        return status.recommended ? status.similarity ?? 1 : 0;
    }
}