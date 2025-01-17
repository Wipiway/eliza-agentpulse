import { Plugin } from "@elizaos/core";
import { newTokenDataAction } from "./actions/newTokenData.ts";

export * as actions from "./actions";
export * as evaluators from "./evaluators";
export * as providers from "./providers";

export const agentpulseCorePlugin: Plugin = {
    name: "agentpulse-core",
    description: "Core agentpulse plugin to fetch AI Agents token data",
    actions: [newTokenDataAction],
    evaluators: [],
    providers: [],
};
