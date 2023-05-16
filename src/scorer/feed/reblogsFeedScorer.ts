import FeedScorer from "../FeedScorer";
import { StatusType } from "../../types";
import { mastodon } from "masto";

export default class reblogsFeedScorer extends FeedScorer {
    constructor() {
        super("reblogsFeed", "More Weight to posts that are reblogged a lot", 6);
    }

    feedExtractor(feed: StatusType[]) {
        return feed.reduce((obj: any, status) => {
            if (status.reblog) {
                obj[status.reblog.uri] = (obj[status.reblog.uri] || 0) + 1;
            } else {
                obj[status.uri] = (obj[status.uri] || 0) + 1;
            }
            return obj;
        }, {});
    }

    async score(status: StatusType) {
        super.score(status);
        const features = this.features;
        if (status.reblog) {
            return features[status.reblog.uri] || 0;
        }
        return 0;
    }
}