import { Plugin } from "@elizaos/core";
import { tokenDataProvider } from "../providers/token-data";

export const tokenDataPlugin: Plugin = {
    name: "agentpulse-core",
    description: "Provides token data from Supabase for AgentPulse analysis",
    providers: [tokenDataProvider],
};
