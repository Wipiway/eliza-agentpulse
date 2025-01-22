import {
    Evaluator,
    IAgentRuntime,
    Memory,
    State,
    MemoryManager,
} from "@elizaos/core";
import { SupabaseDatabaseAdapter } from "@elizaos/adapter-supabase";

const tokenStatusEvaluator: Evaluator = {
    name: "TOKEN_STATUS_EVALUATOR",
    similes: ["UPDATE_TOKEN_STATUS"],
    description: "Updates token status to SEEN after agent tweets about it",

    validate: async (
        runtime: IAgentRuntime,
        message: Memory,
        state?: State
    ) => {
        // Only evaluate messages that are tweets from our agent
        return (
            message.content?.source === "twitter" &&
            message.userId === runtime.agentId &&
            // Check if the tweet contains token analysis content
            message.content.text.includes("Token Launch") &&
            message.content.text.includes("Core Utility")
        );
    },

    handler: async (runtime: IAgentRuntime, message: Memory) => {
        try {
            // Initialize Supabase connection
            const db = new SupabaseDatabaseAdapter(
                process.env.SUPABASE_URL!,
                process.env.SUPABASE_KEY!
            );

            // Extract token name from the tweet content
            const tweetContent = message.content.text;
            const tokenNameMatch = tweetContent.match(
                /Token Launch - (.+?) \(/
            );

            if (!tokenNameMatch) {
                console.log("Could not extract token name from tweet");
                return;
            }

            const tokenName = tokenNameMatch[1].trim();

            // Update token status
            const { data, error } = await db.supabase
                .from("tokens")
                .update({ status: "SEEN" })
                .eq("name", tokenName)
                .select();

            if (error) {
                console.error("Error updating token status:", error);
                return;
            }

            console.log(`Updated status to SEEN for token: ${tokenName}`);

            // Initialize memory manager properly
            const messageManager = new MemoryManager({
                runtime,
                tableName: "messages",
            });

            // Create a memory of this status update
            const statusMemory = await messageManager.addEmbeddingToMemory({
                userId: runtime.agentId,
                content: {
                    text: `Updated status to SEEN for token: ${tokenName}`,
                    source: "token_evaluator",
                },
                roomId: message.roomId,
                agentId: runtime.agentId,
                createdAt: Date.now(),
            });

            await messageManager.createMemory(statusMemory);
        } catch (error) {
            console.error("Error in tokenStatusEvaluator:", error);
        }
    },

    examples: [
        {
            context: `Facts about the actors:
AgentPulse is a crypto analyst that posts about new token launches.`,
            messages: [
                {
                    user: "AgentPulse",
                    content: {
                        text: "[12h ago] Virtuals Token Launch - MyNewToken ($MNT)\n\nCore Utility: Decentralized virtual asset trading platform\n\n✅ Comprehensive documentation\n✅ Active GitHub repository\n✅ Strong community engagement\n✅ Clear roadmap and milestones\n\nKey Highlight: Innovative cross-chain settlement mechanism",
                        source: "twitter",
                    },
                },
            ],
            outcome: "Token status updated to SEEN for MyNewToken",
        },
        {
            context: `Facts about the actors:
AgentPulse is a crypto analyst that posts about new token launches.`,
            messages: [
                {
                    user: "AgentPulse",
                    content: {
                        text: "GM crypto fam! Let's have a great day!",
                        source: "twitter",
                    },
                },
            ],
            outcome: "No status update needed - not a token analysis tweet",
        },
        {
            context: `Facts about the actors:
AgentPulse is a crypto analyst that posts about new token launches.
Current token being analyzed: AlphaToken.`,
            messages: [
                {
                    user: "AgentPulse",
                    content: {
                        text: "[1h ago] Virtuals Token Launch - AlphaToken ($ALPHA)\n\nCore Utility: NFT marketplace and trading platform\n\n✅ Strong tech team\n✅ Audited smart contracts\n✅ Active development\n❌ Limited social presence\n\nKey Highlight: Novel staking mechanism",
                        source: "twitter",
                    },
                },
            ],
            outcome: "Token status updated to SEEN for AlphaToken",
        },
    ],
};

export { tokenStatusEvaluator };
