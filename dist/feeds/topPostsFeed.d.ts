import { mastodon } from "masto";
import { StatusType } from "../types";
export default function getTopPostFeed(api: mastodon.rest.Client): Promise<StatusType[]>;
