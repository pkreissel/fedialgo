import FeedScorer from "../FeedScorer";
import { StatusType } from "../../types";

export default class reblogsFeedScorer extends FeedScorer {
    constructor() {
        super("reblogsFeed", "More Weight to posts that are reblogged a lot", 6);
    }

    feedExtractor(feed: StatusType[]) {
        // for each uri in the feed, count the number of times it appears
        const feedScorer = feed.reduce((obj: Record<string, number>, status: StatusType) => {
            obj[status.uri] = (obj[status.uri] || 0) + 1;
            if (status.reblog) {
                obj[status.reblog.uri] = (obj[status.reblog.uri] || 0) + 1;
            }
            return obj;
        }, {});
        return feedScorer;
    }

    async score(status: StatusType) {
        super.score(status);
        const features = this.features;
        if (status.reblog) {
            return features[status.reblog.uri] || 0;
        }
        return features[status.uri] || 0;
    }
}