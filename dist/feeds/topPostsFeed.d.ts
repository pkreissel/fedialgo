import { mastodon } from "masto";
export default function getTopPostFeed(api: mastodon.rest.Client): Promise<mastodon.v1.Status[]>;
