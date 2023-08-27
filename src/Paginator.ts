import { mastodon } from "masto";
import TheAlgorithm from "./index";
import { StatusType } from "./types";

interface PaginationResult<StatusType> {
    data: StatusType[];
    hasNextPage: boolean;
}

export default class ForYouPaginator implements mastodon.Paginator<mastodon.v1.Status[]> {
    data: mastodon.v1.Status[]
    currentIndex: number
    direction: "next" | "prev"
    constructor(data: mastodon.v1.Status[]) {
        this.data = data
        this.currentIndex = 0
        this.direction = "next"
    }
    return(value: PromiseLike<undefined> | undefined): Promise<IteratorResult<mastodon.v1.Status[], undefined>> {
        throw new Error("Method not implemented.");
    }
    [Symbol.asyncIterator](): AsyncIterator<mastodon.v1.Status[], undefined, string | undefined> {
        throw new Error("Method not implemented.");
    }

    then<TResult1 = mastodon.v1.Status[], TResult2 = never>(onfulfilled?: ((value: mastodon.v1.Status[]) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): PromiseLike<TResult1 | TResult2> {
        throw new Error("Method not implemented.");
    }

    async next(): Promise<IteratorResult<mastodon.v1.Status[], undefined>> {
        if (this.currentIndex < this.data.length) {
            const result = this.data.slice(this.currentIndex, this.currentIndex + 10)
            this.currentIndex += 10
            return { value: result, done: false }
        }
        return { value: undefined, done: true }
    }

    getDirection(): "next" | "prev" {
        return this.direction;
    }

    setDirection(direction: "next" | "prev"): mastodon.Paginator<mastodon.v1.Status[], undefined> {
        this.direction = direction;
        return this;
    }

    clone(): mastodon.Paginator<mastodon.v1.Status[], undefined> {
        const clonedPaginator = new ForYouPaginator(this.data);
        clonedPaginator.currentIndex = this.currentIndex;
        return clonedPaginator;
    }

    async throw(e?: unknown): Promise<IteratorResult<mastodon.v1.Status[], undefined>> {
        return { value: undefined, done: true }
    }

    async *values(): AsyncIterableIterator<mastodon.v1.Status[]> {
        for (const status of this.data) {
            yield [status];
        }
    }
}