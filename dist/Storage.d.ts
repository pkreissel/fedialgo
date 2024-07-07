import { StorageValue } from "./types";
import { mastodon } from "masto";
export declare enum Key {
    TOP_FAVS = "favs",
    TOP_REBLOGS = "reblogs",
    TOP_INTERACTS = "interacts",
    CORE_SERVER = "coreServer",
    USER = "algouser",
    WEIGHTS = "weights",
    OPENINGS = "openings",
    LAST_OPENED = "lastOpened"
}
export default class Storage {
    protected static get(key: Key, groupedByUser?: boolean, suffix?: string): Promise<StorageValue>;
    protected static set(key: Key, value: StorageValue, groupedByUser?: boolean, suffix?: string): Promise<void>;
    static suffix(key: Key, suffix: string): string;
    protected static remove(key: Key, groupedByUser?: boolean, suffix?: string): Promise<void>;
    protected static prefix(key: string): Promise<string>;
    static logOpening(): Promise<void>;
    static getLastOpened(): Promise<number>;
    static getOpenings(): Promise<number>;
    static getIdentity(): Promise<mastodon.v1.Account>;
    static setIdentity(user: mastodon.v1.Account): Promise<void>;
}
