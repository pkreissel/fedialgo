import FeedScorer from '../../src/scorer/FeedScorer';
import { mastodon } from 'masto';

describe('FeedScorer', () => {
    it('should initialize with correct properties', () => {
        const scorer = new FeedScorer('TestFeed', 'A test feed scorer', 3);

        expect(scorer.getVerboseName()).toBe('TestFeed');
        expect(scorer.getDescription()).toBe('A test feed scorer');
        expect(scorer.getDefaultWeight()).toBe(3);
    });

    it('should set feed and extract features', async () => {
        class MockFeedScorer extends FeedScorer {
            feedExtractor(feed: any[]) {
                return { 'test': feed.length };
            }
        }

        const scorer = new MockFeedScorer('TestFeed');
        const mockFeed = [{}, {}] as any;
        
        await scorer.setFeed(mockFeed);
        expect(scorer.features).toEqual({ 'test': 2 });
        // @ts-ignore
        expect(scorer._isReady).toBe(true);
    });

    it('score should throw if not ready', async () => {
        const scorer = new FeedScorer('TestFeed');
        
        await expect(scorer.score({} as mastodon.v1.Status)).rejects.toThrow('FeedScorer not ready');
    });

    it('score should return 0 if ready', async () => {
        class MockFeedScorer extends FeedScorer {
            feedExtractor() { return {}; }
        }
        const scorer = new MockFeedScorer('TestFeed');
        await scorer.setFeed([]);
        
        const score = await scorer.score({} as mastodon.v1.Status);
        expect(score).toBe(0);
    });

    it('feedExtractor throws by default', () => {
        const scorer = new FeedScorer('TestFeed');
        expect(() => scorer.feedExtractor([])).toThrow('Method not implemented.');
    });
});
