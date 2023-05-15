import { mastodon } from "masto";
import { StatusType } from "../types";
export default class FeedScorer {
    private _verboseName;
    private _isReady;
    private _description;
    features: any;
    constructor(verboseName: string, description?: string);
    setFeed(feed: StatusType[]): Promise<void>;
    feedExtractor(feed: StatusType[]): any;
    score(status: mastodon.v1.Status): Promise<number>;
    getVerboseName(): string;
    getDescription(): string;
}
