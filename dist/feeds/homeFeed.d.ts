import { mastodon } from "masto";
export default function getHomeFeed(api: mastodon.rest.Client, user: mastodon.v1.Account): Promise<any[]>;
