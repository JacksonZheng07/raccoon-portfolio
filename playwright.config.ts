import { defineConfig } from "@playwright/test";

/*
 * The static export is served, not `next start`: these tests have to exercise
 * the same `out/` directory GitHub Pages receives, including 404.html.
 *
 * The port is configurable because 3000 is also `npm run dev`'s port, and a
 * dev server left running makes the whole suite time out waiting for a server
 * it did not start. Default stays out of that way.
 */
const port = Number(process.env.E2E_PORT ?? 4300);

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: { baseURL: `http://127.0.0.1:${port}` },
  webServer: {
    command: `npm run build && npx serve out -l ${port}`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
