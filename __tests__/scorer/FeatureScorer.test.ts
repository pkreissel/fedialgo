import FeatureScorer from '../../src/scorer/FeatureScorer';
import { mastodon } from 'masto';

describe('FeatureScorer', () => {
    it('should initialize with correct properties', () => {
        const getter = async () => ({ 'test': 1 });
        const scorer = new FeatureScorer({
            featureGetter: getter,
            verboseName: 'TestFeature',
            description: 'A test feature',
            defaultWeight: 5
        });

        expect(scorer.getVerboseName()).toBe('TestFeature');
        expect(scorer.getDescription()).toBe('A test feature');
        expect(scorer.getDefaultWeight()).toBe(5);
    });

    it('should fetch and set feature data', async () => {
        const mockApi = {} as mastodon.rest.Client;
        const getter = async (api: mastodon.rest.Client) => {
            expect(api).toBe(mockApi);
            return { 'alice@server.com': 10 };
        };

        const scorer = new FeatureScorer({
            featureGetter: getter,
            verboseName: 'TestFeature'
        });

        await scorer.getFeature(mockApi);
        expect(scorer.feature).toEqual({ 'alice@server.com': 10 });
        // @ts-ignore
        expect(scorer._isReady).toBe(true);
    });

    it('score should return 0 by default', async () => {
        const scorer = new FeatureScorer({
            featureGetter: async () => ({}),
            verboseName: 'TestFeature'
        });

        const score = await scorer.score({} as any, {} as any);
        expect(score).toBe(0);
    });
});
