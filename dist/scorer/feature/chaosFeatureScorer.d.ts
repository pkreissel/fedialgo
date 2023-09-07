import FeatureScorer from '../FeatureScorer';
import { StatusType } from '../../types';
import { mastodon } from 'masto';
export default class chaosFeatureScorer extends FeatureScorer {
    constructor();
    score(api: mastodon.rest.Client, status: StatusType): Promise<0 | 1>;
}
