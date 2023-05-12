import FeedScorer from "../FeedScorer";
import { StatusType } from "../../types";
export default class reblogsFeedScorer extends FeedScorer {
    constructor();
    feedExtractor(feed: StatusType[]): any;
    score(status: StatusType): Promise<any>;
}
