import { mastodon } from "masto";
export default function getTopPostFeed(api: mastodon.Client): Promise<mastodon.v1.Status[]>;
