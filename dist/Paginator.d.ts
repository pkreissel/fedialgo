import { mastodon } from "masto";
export default class ForYouPaginator implements mastodon.Paginator<mastodon.v1.Status[]> {
    data: mastodon.v1.Status[];
    currentIndex: number;
    direction: "next" | "prev";
    constructor(data: mastodon.v1.Status[]);
    return(value: PromiseLike<undefined> | undefined): Promise<IteratorResult<mastodon.v1.Status[], undefined>>;
    [Symbol.asyncIterator](): AsyncIterator<mastodon.v1.Status[], undefined, string | undefined>;
    then<TResult1 = mastodon.v1.Status[], TResult2 = never>(onfulfilled?: ((value: mastodon.v1.Status[]) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): PromiseLike<TResult1 | TResult2>;
    next(): Promise<IteratorResult<mastodon.v1.Status[], undefined>>;
    getDirection(): "next" | "prev";
    setDirection(direction: "next" | "prev"): mastodon.Paginator<mastodon.v1.Status[], undefined>;
    clone(): mastodon.Paginator<mastodon.v1.Status[], undefined>;
    throw(e?: unknown): Promise<IteratorResult<mastodon.v1.Status[], undefined>>;
    values(): AsyncIterableIterator<mastodon.v1.Status[]>;
}
