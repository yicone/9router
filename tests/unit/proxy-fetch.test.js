import { describe, expect, it } from "vitest";
import { shouldUseOriginalFetch } from "open-sse/utils/proxyFetch.js";

describe("proxyFetch loopback handling", () => {
  it("keeps loopback URLs on the original fetch", () => {
    expect(shouldUseOriginalFetch("http://127.0.0.1:20128/v1/models")).toBe(true);
    expect(shouldUseOriginalFetch("http://localhost:20128/v1/models")).toBe(true);
    expect(shouldUseOriginalFetch("http://[::1]:20128/v1/models")).toBe(true);
  });

  it("keeps relative URLs on the original fetch", () => {
    expect(shouldUseOriginalFetch("/api/providers")).toBe(true);
  });

  it("routes external URLs through undici fetch", () => {
    expect(shouldUseOriginalFetch("https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell")).toBe(false);
  });
});
