export const mockAccount = (id: string, acct: string) => ({
    id,
    acct,
    username: acct.split('@')[0],
    displayName: acct.split('@')[0],
    locked: false,
    bot: false,
    discoverable: true,
    group: false,
    created_at: new Date().toISOString(),
    note: '',
    url: `https://${acct.split('@')[1] || 'example.com'}/@${acct}`,
    avatar: '',
    avatarStatic: '',
    header: '',
    headerStatic: '',
    followersCount: 100,
    followingCount: 100,
    statusesCount: 100,
    lastStatusAt: new Date().toISOString(),
});

export const mockStatus = (id: string, accountAcct: string, reblogAccountAcct?: string) => {
    const account = mockAccount(accountAcct, accountAcct);
    const reblog = reblogAccountAcct ? { account: mockAccount(reblogAccountAcct, reblogAccountAcct) } : null;
    return {
        id,
        created_at: new Date().toISOString(),
        in_reply_to_id: null,
        in_reply_to_account_id: null,
        sensitive: false,
        spoiler_text: '',
        visibility: 'public',
        language: 'en',
        uri: '',
        url: '',
        replies_count: 0,
        reblogs_count: 0,
        favourites_count: 0,
        edited_at: null,
        favourited: false,
        reblogged: false,
        muted: false,
        bookmarked: false,
        content: 'Test content',
        reblog,
        account,
        media_attachments: [],
        mentions: [],
        tags: [],
        emojis: [],
        card: null,
        poll: null,
    };
};

export const mockNotification = (id: string, type: string, accountAcct: string) => ({
    id,
    type,
    created_at: new Date().toISOString(),
    account: mockAccount(accountAcct, accountAcct),
});

export function createMockMastodonClient(data: {
    favourites?: any[][];
    notifications?: any[][];
    reblogs?: any[][];
    following?: any[][];
    serverDomain?: string;
}) {
    return {
        v1: {
            favourites: {
                async *list() {
                    for (const page of (data.favourites || [])) {
                        yield page;
                    }
                }
            },
            notifications: {
                async *list() {
                    for (const page of (data.notifications || [])) {
                        yield page;
                    }
                }
            },
            accounts: {
                $select: (id: string) => ({
                    statuses: {
                        async *list() {
                            for (const page of (data.reblogs || [])) {
                                yield page;
                            }
                        }
                    },
                    following: {
                        async *list() {
                            for (const page of (data.following || [])) {
                                yield page;
                            }
                        }
                    }
                }),
                verifyCredentials: async () => mockAccount('1', 'me@server.com')
            },
            instance: {
                fetch: async () => ({
                    domain: data.serverDomain || 'server.com',
                })
            }
        },
        v2: {
            instance: {
                fetch: async () => ({
                    domain: data.serverDomain || 'server.com',
                })
            }
        }
    } as any;
}
