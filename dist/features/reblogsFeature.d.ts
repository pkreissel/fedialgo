import { mastodon } from "masto";
export default function getReblogsFeature(api: mastodon.rest.Client, user: mastodon.v1.Account): Promise<Record<string, number>>;
