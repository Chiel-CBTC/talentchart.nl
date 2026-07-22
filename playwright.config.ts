import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      EMAIL_TEST_MODE: "true",
    },
  },
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Playwright's own downloaded Chromium is a glibc build and cannot run
        // on this Alpine/musl server. CI (Ubuntu, glibc) is unaffected since
        // this env var is unset there. Locally on this server, point at the
        // Alpine-native chromium package instead (`apk add --no-cache chromium`).
        ...(process.env.PLAYWRIGHT_LOCAL_CHROMIUM
          ? { launchOptions: { executablePath: process.env.PLAYWRIGHT_LOCAL_CHROMIUM } }
          : {}),
      },
    },
  ],
});
