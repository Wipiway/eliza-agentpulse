import { Provider, IAgentRuntime, Memory, State } from "@elizaos/core";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { TokenData } from "../types";

class TokenDataProvider implements Provider {
    private supabase: SupabaseClient;
    private cache: Map<string, { data: unknown; timestamp: number }> =
        new Map();
    private CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_KEY!
        );
    }

    private async fetchWithCache<T>(
        key: string,
        fetcher: () => Promise<T>
    ): Promise<T> {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
            return cached.data as T;
        }

        const data = await fetcher();
        if (data) {
            this.cache.set(key, { data, timestamp: Date.now() });
        }
        return data;
    }

    private async getLatestTokens(): Promise<TokenData[]> {
        const { data, error } = await this.supabase
            .from("tokens")
            .select("*")
            .eq("trading", true)
            .order("launched_at", { ascending: false })
            .limit(5);

        if (error) throw error;
        return data || []; // Return empty array if no data
    }

    private formatTokenAnalysis(tokens: TokenData[]): string {
        return tokens
            .map((token) => {
                const marketCap = token.market_cap
                    ? `$${parseFloat(token.market_cap).toLocaleString()}`
                    : "N/A";
                const volume24h = token.volume_24h
                    ? `$${parseFloat(token.volume_24h).toLocaleString()}`
                    : "N/A";
                const price = token.price
                    ? `$${parseFloat(token.price).toLocaleString()}`
                    : "N/A";

                return `
${token.name} ($${token.ticker || "N/A"})
• Price: ${price}
• Market Cap: ${marketCap}
• 24h Volume: ${volume24h}
• Launch Date: ${new Date(token.launched_at).toLocaleDateString()}
${token.twitter ? `• Twitter: ${token.twitter}` : ""}
${token.website ? `• Website: ${token.website}` : ""}
${token.description ? `• Description: ${token.description}` : ""}
`.trim();
            })
            .join("\n\n");
    }

    async get(
        runtime: IAgentRuntime,
        message: Memory,
        state?: State
    ): Promise<string> {
        try {
            console.log("**** ikoooos -- Getting token data");
            const tokens = await this.fetchWithCache<TokenData[]>(
                "latest_tokens",
                () => this.getLatestTokens()
            );

            return this.formatTokenAnalysis(tokens);
        } catch (error) {
            console.error("Token data provider error:", error);
            return "Token data temporarily unavailable. probably nothing ser 👀";
        }
    }
}

export const tokenDataProvider = new TokenDataProvider();
