# fedialgo

Fedialgo is an typescript module, that can be used to produce an algorithmic fediverse experience. This will replace the project "fedifeed" and make it possible to implement the idea into all kinds of other projects. It uses React Native Async Storage, so it should also work in React Native Projects, but havent tested it yet. 

## Local Install
Run:

```console
npm install
npm link
```
Then in your local project:
```console
npm link fedialgo
```
Use // @ts-ignore if you run into Typescript warnings (because your project might also use masto)
```console
npm run build
```
in fedialgo directory after changes and they will automatically be detected

## Usage

```typescript
import TheAlgorithm from "fedialgo"
import { login, mastodon } from "masto";

const api: mastodon.Client = await login({
                    url: user.server,
                    accessToken: user.access_token,
                });
const currUser = await api.v1.accounts.verifyCredentials()
const algo = new TheAlgorithm(api, currUser)
const feed = await algo.getFeed()
 
 ```


This is untested early alpha so might be due to massive unannounced changes.
