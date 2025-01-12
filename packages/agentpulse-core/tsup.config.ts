import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    outDir: "dist",
    sourcemap: true,
    clean: true,
    format: ["esm"],
    target: "node18",
    dts: true,
    splitting: false,
    treeshake: true,
    minify: false,
    external: [
        "dotenv",
        "fs",
        "path",
        "@supabase/supabase-js",
        "@elizaos/core",
    ],
    esbuildOptions(options) {
        options.platform = "node";
    },
});
