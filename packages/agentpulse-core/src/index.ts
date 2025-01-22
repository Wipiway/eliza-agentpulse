import { Plugin } from "@elizaos/core";
import { newTokenDataAction } from "./actions/newTokenData";
import { providers } from "@elizaos/plugin-bootstrap";
import { newTokenDataProvider } from "./providers/newTokenDataProvider";

// Export individual components (even if empty for now)
export * as actions from "./actions";
export * as evaluators from "./evaluators";
export * as providers from "./providers";

// Change to named export matching the expected pattern
export const agentpulseCorePlugin: Plugin = {
    name: "agentpulse-core",
    description: "Core agentpulse plugin to fetch AI Agents token data",
    actions: [],
    evaluators: [],
    providers: [providers.timeProvider, newTokenDataProvider],
};

// You can keep your console.logs if needed
console.log("Plugin configuration object created:", {
    name: agentpulseCorePlugin.name,
    actionsCount: agentpulseCorePlugin.actions?.length || 0,
});
