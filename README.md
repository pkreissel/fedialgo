# fedialgo

## Usage

```typescript

const api: mastodon.Client = await login({
                    url: user.server,
                    accessToken: user.access_token,
                });
const algo = new TheAlgorithm(api)
const feed = await algo.getFeed()
 
