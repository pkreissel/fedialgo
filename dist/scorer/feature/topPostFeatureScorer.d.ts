import FeatureScorer from '../FeatureScorer';
import { StatusType } from "../../types";
import { mastodon } from "masto";
export default class topPostFeatureScorer extends FeatureScorer {
    constructor();
    score(_api: mastodon.rest.Client, status: StatusType): Promise<0 | 1>;
}
