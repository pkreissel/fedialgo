import { mastodon } from "masto";
import { serverFeatureType, accFeatureType } from "../types";
import FavsFeature from "./favsFeature";
import reblogsFeature from "./reblogsFeature";
import interactsFeature from "./interactsFeature";
import coreServerFeature from "./coreServerFeature";
import Storage, { Key } from "../Storage";


export default class FeatureStorage extends Storage {
    static async getTopFavs(api: mastodon.rest.Client): Promise<accFeatureType> {
        const topFavs: accFeatureType = await this.get(Key.TOP_FAVS) as accFeatureType;
        console.log(topFavs);
        if (topFavs != null && await this.getOpenings() < 10) {
            return topFavs;
        } else {
            const favs = await FavsFeature(api);
            await this.set(Key.TOP_FAVS, favs);
            return favs;
        }
    }

    static async getTopReblogs(api: mastodon.rest.Client): Promise<accFeatureType> {
        const topReblogs: accFeatureType = await this.get(Key.TOP_REBLOGS) as accFeatureType;
        console.log(topReblogs);
        if (topReblogs != null && await this.getOpenings() < 10) {
            return topReblogs;
        } else {
            const reblogs = await reblogsFeature(api);
            await this.set(Key.TOP_REBLOGS, reblogs);
            return reblogs;
        }
    }

    static async getTopInteracts(api: mastodon.rest.Client): Promise<accFeatureType> {
        const topInteracts: accFeatureType = await this.get(Key.TOP_INTERACTS) as accFeatureType;
        console.log(topInteracts);
        if (topInteracts != null && await this.getOpenings() < 10) {
            return topInteracts;
        } else {
            const interacts = await interactsFeature(api);
            await this.set(Key.TOP_INTERACTS, interacts);
            return interacts;
        }
    }

    static async getCoreServer(api: mastodon.rest.Client): Promise<serverFeatureType> {
        const coreServer: serverFeatureType = await this.get(Key.CORE_SERVER) as serverFeatureType;
        console.log(coreServer);
        if (coreServer != null && await this.getOpenings() < 10) {
            return coreServer;
        } else {
            const user = await this.getIdentity();
            const server = await coreServerFeature(api, user);
            await this.set(Key.CORE_SERVER, server);
            return server;
        }
    }

}
