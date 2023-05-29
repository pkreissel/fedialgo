import FeedScorer from "../FeedScorer";
import { StatusType } from "../../types";

export default class diversityFeedScorer extends FeedScorer {
    constructor() {
        super("Diversity", "Downranks posts from users that you have seen a lot of posts from");
    }

    feedExtractor(feed: StatusType[]) {
        return feed.reduce((obj: any, status) => {
            obj[status.account.acct] = (obj[status.account.acct] || 0) - 1;
            return obj;
        }, {});
    }

    async score(status: StatusType) {
        super.score(status);
        const frequ = this.features[status.account.acct]
        this.features[status.account.acct] = frequ + 1
        return frequ + 1
    }
}