import { unstable_dev } from "wrangler";
import type { UnstableDevWorker } from "wrangler";
import { describe, expect, it, beforeAll, afterAll } from "vitest";

describe("Worker", () => {
  let worker: UnstableDevWorker;

  beforeAll(async () => {
    worker = await unstable_dev("test/testWorkerMultiStep.ts", {
      experimental: { disableExperimentalWarning: true },
    });
  });

  afterAll(async () => {
    await worker.stop();
  });

  it("should retain context between multiple calls", async () => {
    const response = await worker.fetch("/", {
      method: "POST",
      body: JSON.stringify({
        prompt: "This is a test sentence",
      }),
    });

    const result = (await response.json()) as any;
    expect(result.response).toBe("This is a test sentence!!");
  });
});
