import { mastodon } from "masto";
export default function getHomeFeed(api: mastodon.Client, user: mastodon.v1.Account): Promise<any[]>;
