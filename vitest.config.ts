import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        testTimeout: 50000,
        environment: "miniflare",
        // Configuration is automatically loaded from `.env`, `package.json` and
        // `wrangler.toml` files by default, but you can pass any additional Miniflare
        // API options here:
        environmentOptions: {
        },
    },
})
