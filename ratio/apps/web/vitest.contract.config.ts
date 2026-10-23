import path from "path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.contract.test.ts"],
    env: { VITE_API_URL: process.env.CONTRACT_API_URL ?? "" },
    testTimeout: 30000,
  },
})
