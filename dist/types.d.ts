import { mastodon } from 'masto';
export interface weightsType {
    [key: string]: number;
}
export type accFeatureType = {
    [key: mastodon.v1.Account["acct"]]: number;
};
export type serverFeatureType = {
    [key: mastodon.v1.Instance["uri"]]: number;
};
export interface StatusType extends mastodon.v1.Status {
    topPost?: boolean;
    scores?: weightsType;
    value?: number;
    reblog?: StatusType;
    reblogBy?: string;
}
export type FeedFetcher = (api: mastodon.Client) => Promise<StatusType[]>;
export type Scorer = (api: mastodon.Client, status: StatusType) => number;
