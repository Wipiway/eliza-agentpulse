import { Plugin } from "@elizaos/core";
import { tokenDataProvider } from "../providers/token-data";

export const agentPulsePlugin: Plugin = {
    name: "agentpulse",
    description:
        "Provides token and market data analysis for crypto assets through AgentPulse",
    providers: [tokenDataProvider],
    actions: [],
    evaluators: [],
    services: [],
    clients: [],
};

export default agentPulsePlugin;
