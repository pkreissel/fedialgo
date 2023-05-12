import FeatureScorer from '../FeatureScorer';
import { StatusType } from '../../types';
import { mastodon } from 'masto';
export default class favsFeatureScorer extends FeatureScorer {
    constructor();
    score(api: mastodon.Client, status: StatusType): Promise<number>;
}
