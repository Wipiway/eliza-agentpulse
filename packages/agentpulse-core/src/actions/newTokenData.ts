import {
    ActionExample,
    IAgentRuntime,
    Memory,
    type Action,
} from "@elizaos/core";

export const newTokenDataAction: Action = {
    name: "NEW_TOKEN_DATA",
    similes: [
        "TOKEN_DATA",
        "NEW_LAUNCHES",
        "NEW_PROJECT",
        "NEW_AGENT",
        "VIRTUALS_AGENT",
        "DEFAULT",
    ],
    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        console.log("****** IKOOOSSS!!!");
        return true;
    },
    description:
        "Get info for some recent small-cap AI Agent tokens launched on the Virtuals Protocol",
    handler: async (
        _runtime: IAgentRuntime,
        _message: Memory
    ): Promise<string> => {
        const tokenData = `
            Token: IKOS
            Price: 20000
            Market Cap: 1000000
            Volume: 100000
            Launch Date: 2024-01-01
            Project: Virtuals
            Agent: IKOS

            Token: ZAZU
            Price: 20000
            Market Cap: 1000000
            Volume: 100000
            Launch Date: 2024-01-01
            Project: Virtuals
            Agent: ZAZU
        `;
        return tokenData;
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "Hey whats the latest on the new AI Agents?" },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Here's some recent AI agent token data:",
                    action: "NEW_TOKEN_DATA",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What are some interesting tokens on Virtuals?",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Here are a few interesting recent tokens launched on Virtuals:",
                    action: "NEW_TOKEN_DATA",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Can you show me some market data for new AI agents?",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Sure, here's the latest market data for some new AI agents:",
                    action: "NEW_TOKEN_DATA",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What's the market cap of IKOS?",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Let me pull up the token data for you:",
                    action: "NEW_TOKEN_DATA",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;
