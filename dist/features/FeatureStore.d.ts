import { mastodon } from "masto";
import { serverFeatureType, accFeatureType } from "../types";
import Storage from "../Storage";
export default class FeatureStorage extends Storage {
    static getTopFavs(api: mastodon.Client): Promise<accFeatureType>;
    static getTopReblogs(api: mastodon.Client): Promise<accFeatureType>;
    static getTopInteracts(api: mastodon.Client): Promise<accFeatureType>;
    static getCoreServer(api: mastodon.Client): Promise<serverFeatureType>;
}
