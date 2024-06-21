import { mastodon } from "masto";
import { StatusType } from "../types";
export default function getRecommenderFeed(api: mastodon.rest.Client, user: mastodon.v1.Account): Promise<StatusType[]>;
