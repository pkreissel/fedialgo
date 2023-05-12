import { mastodon } from "masto";
import { StatusType } from "./types";
export declare class StaticArrayPaginator implements AsyncIterableIterator<StatusType[]> {
    private currentIndex;
    private pageSize;
    private dataArray;
    private algo;
    constructor(api: mastodon.Client, user: mastodon.v1.Account, pageSize?: number);
    next(): Promise<IteratorResult<StatusType[]>>;
    [Symbol.asyncIterator](): this;
}
