// Integration tests for the algorithm
import TheAlgorithm from '../src/index';
import { createRestAPIClient, mastodon } from "masto"
import Storage from '../src/Storage';
import dotenv from 'dotenv';
dotenv.config();


//mock async storage
jest.mock("@react-native-async-storage/async-storage", () => (require('@react-native-async-storage/async-storage/jest/async-storage-mock')));

describe('TheAlgorithm', () => {
    let api: mastodon.rest.Client;
    let algo: TheAlgorithm;
    beforeAll(async () => {
        if (!AbortSignal.timeout) {
            AbortSignal.timeout = jest.fn();
        }
        api = createRestAPIClient({
            accessToken: process.env.MASTODON_TOKEN as string,
            url: process.env.MASTODON_URL as string,
        })
        const user = await api.v1.accounts.verifyCredentials();
        algo = new TheAlgorithm(api, user);
    })

    it('should set Identity, LastOpened, Openings and default Weights', async () => {
        const user = await api.v1.accounts.verifyCredentials();
        expect(algo).toBeDefined();
        expect(await Storage.getIdentity()).toEqual(user);
        expect(await Storage.getLastOpened()).toBeDefined();
        expect(await Storage.getOpenings()).toBeGreaterThan(0);
        const weights = await algo.getWeights();
        expect(weights).toBeDefined();
        expect(Object.values(weights).reduce((a, b) => a && Boolean(b), true)).toBe(true);
    })

    it("should return a feed", async () => {
        const feed = await algo.getFeed();
        expect(feed).toBeDefined();
        expect(feed.length).toBeGreaterThan(0);
    }, 20000)

    it("should return a working paginator", async () => {
        const paginator = algo.list()
        expect(paginator).toBeDefined();
        const page = await paginator.next();
        expect(page).toBeDefined();
        expect(page.value).toBeDefined();
        expect(page.done).toBe(false);
        const page2 = await paginator.next();
        expect(page2).toBeDefined();
    })

    it("should change weights", async () => {
        const weights = await algo.getWeights();
        const newWeights = { ...weights, Favs: 5 }
        const adjusted = await algo.weightAdjust(newWeights);
        console.log(adjusted);
        if (adjusted) {
            expect(Object.values(adjusted).reduce((a, b) => a && Boolean(b), true)).toBe(true); //check that all values are defined
            expect(adjusted["Favs"]).toBeGreaterThan(weights["Favs"]); //check that favs has increased
        } else {
            expect(adjusted).toBeDefined();
        }
    })
})
