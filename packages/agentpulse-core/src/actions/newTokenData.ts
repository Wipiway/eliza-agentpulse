import {
    ActionExample,
    IAgentRuntime,
    HandlerCallback,
    Memory,
    type Action,
    State,
} from "@elizaos/core";

console.log("Step 3: Loading newTokenDataAction module");

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
        console.log(
            "Step 5: Validate method called for NEW_TOKEN_DATA action",
            _message
        );
        return true;
    },
    description:
        "Get info for some recent small-cap AI Agent tokens launched on the Virtuals Protocol",
    handler: async (
        _runtime: IAgentRuntime,
        _message: Memory,
        state: State,
        options: any,
        callback: HandlerCallback
    ) => {
        console.log("Step 6: Handler method called for NEW_TOKEN_DATA action");
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

        callback?.({
            text: "THIS IS MY ONLY CUSTOM RESPONSE!!!!!",
        });

        console.log("Step 7: MESSAGE - ", _message);

        // // Create a new message with the response
        // await _runtime.messageManager.createMemory({
        //     id: _message.id,
        //     content: { text: "THIS IS MY ONLY CUSTOM RESPONSE!!!!!" },
        //     roomId: _message.roomId,
        //     userId: _message.userId,
        //     agentId: _runtime.agentId,
        // });

        // // Update the message content directly
        // _message.content = {
        //     text: "THIS IS MY ONLY CUSTOM RESPONSE!!!!!",
        //     action: "NEW_TOKEN_DATA",
        // };

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

console.log("Step 4: newTokenDataAction configured:", {
    name: newTokenDataAction.name,
    similesCount: newTokenDataAction.similes.length,
});
