import { mastodon } from "masto";
import { StatusType } from "../types";
export default class FeedScorer {
    private _verboseName;
    private _isReady;
    private _description;
    private _defaultWeight;
    features: any;
    constructor(verboseName: string, description?: string, defaultWeight?: number);
    setFeed(feed: StatusType[]): Promise<void>;
    feedExtractor(feed: StatusType[]): any;
    score(status: mastodon.v1.Status): Promise<number>;
    getVerboseName(): string;
    getDescription(): string;
    getDefaultWeight(): number;
}
