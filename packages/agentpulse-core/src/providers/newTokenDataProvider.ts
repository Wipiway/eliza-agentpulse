import {
    embed,
    MemoryManager,
    formatMessages,
    AgentRuntime as IAgentRuntime,
} from "@elizaos/core";
import type { Memory, Provider, State } from "@elizaos/core";
import { SupabaseDatabaseAdapter } from "@elizaos/adapter-supabase";

const newTokenDataProvider: Provider = {
    get: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        try {
            // Use the Eliza Supabase adapter
            const db = new SupabaseDatabaseAdapter(
                process.env.SUPABASE_URL!,
                process.env.SUPABASE_KEY!
            );

            console.log("***** STEPPPPING 1 - Getting new tokens...!!");

            // Get access to the underlying database connection

            const { data: tokens, error } = await db.supabase
                .from("tokens")
                .select(
                    `
                    id,
                    name,
                    ticker,
                    description,
                    twitter,
                    telegram,
                    website,
                    launched_at,
                    price,
                    market_cap,
                    volume_24h
                `
                )
                .eq("status", "PENDING_RESEARCH")
                // .gte(
                //     "launched_at",
                //     new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
                // )
                .order("launched_at", { ascending: false })
                .limit(5);

            if (error) {
                console.error("Error fetching tokens:", error);
                return "Sorry, I encountered an error while fetching token data.";
            }

            if (!tokens || tokens.length === 0) {
                return "All recent tokens have been reviewed, no new tokens to check for now.";
            }

            // Format the token data into a readable string
            const formattedTokens = tokens
                .map(
                    (token) => `
Token Name: ${token.name || "N/A"}
Ticker: ${token.ticker || "N/A"}
Description: ${token.description || "No description available"}
Price: ${token.price || "N/A"}
Market Cap: ${token.market_cap || "N/A"}
24h Volume: ${token.volume_24h || "N/A"}
Launch Date: ${new Date(token.launched_at).toLocaleDateString()}
Social Links:
- Twitter: ${token.twitter || "N/A"}
- Telegram: ${token.telegram || "N/A"}
- Website: ${token.website || "N/A"}
-------------------`
                )
                .join("\n\n");

            // Update the status of processed tokens to AGENT-SEEN
            const tokenIds = tokens.map((token) => token.id);
            const { error: updateError } = await db.supabase
                .from("tokens")
                .update({ status: "AGENT-SEEN" })
                .in("id", tokenIds);

            if (updateError) {
                console.error("Error updating token status:", updateError);
                // Continue execution even if update fails
            }

            console.log("**** Formatted tokens:", formattedTokens);

            return `Here are the latest 5 tokens:\n\n${formattedTokens}`;
        } catch (error) {
            console.error("Error in newTokenDataProvider:", error);
            return "Sorry, I encountered an error while processing token data.";
        }
    },
};

export { newTokenDataProvider };
