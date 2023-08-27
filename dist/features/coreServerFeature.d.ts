import { mastodon } from "masto";
import { serverFeatureType } from "../types";
export default function coreServerFeature(api: mastodon.rest.Client, user: mastodon.v1.Account): Promise<serverFeatureType>;
