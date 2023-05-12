import { mastodon } from "masto";
import TheAlgorithm from "./index";
import { StatusType } from "./types";

interface PaginationResult<StatusType> {
    data: StatusType[];
    hasNextPage: boolean;
}

export class StaticArrayPaginator implements AsyncIterableIterator<StatusType[]> {
    private currentIndex: number = 0;
    private pageSize: number;
    private dataArray: StatusType[] = [];
    private algo: TheAlgorithm;

    constructor(api: mastodon.Client, user: mastodon.v1.Account, pageSize: number = 10) {
        this.algo = new TheAlgorithm(api, user);
        this.pageSize = pageSize;
    }

    async next(): Promise<IteratorResult<StatusType[]>> {
        if (this.dataArray.length == 0) {
            this.dataArray = await this.algo.getFeed();
        }
        const data: StatusType[] = [];
        let hasNextPage = false;

        const startIndex = this.currentIndex;
        const endIndex = this.currentIndex + this.pageSize;
        const currentData = this.dataArray.slice(startIndex, endIndex);

        currentData.forEach((item) => data.push(item));

        if (endIndex < this.dataArray.length) {
            hasNextPage = true;
        }

        this.currentIndex += this.pageSize;

        return {
            done: !hasNextPage,
            value: data as StatusType[]
        };
    }

    [Symbol.asyncIterator]() {
        return this
    }
}