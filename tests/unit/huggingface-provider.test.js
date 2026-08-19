import { afterEach, describe, expect, it, vi } from "vitest";
import {
  HUGGINGFACE_INFERENCE_BASE_URL,
  HUGGINGFACE_WHOAMI_URL,
  validateHuggingFaceToken,
} from "@/lib/huggingface";
import huggingface from "open-sse/providers/registry/huggingface.js";

describe("HuggingFace provider", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("validates tokens via whoami-v2", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });

    const result = await validateHuggingFaceToken("hf_test", fetchMock);

    expect(result).toEqual({ valid: true, error: null, status: 200 });
    expect(fetchMock).toHaveBeenCalledWith(HUGGINGFACE_WHOAMI_URL, expect.objectContaining({
      method: "GET",
      headers: expect.objectContaining({
        Authorization: "Bearer hf_test",
        Accept: "application/json",
      }),
    }));
  });

  it("treats non-2xx whoami-v2 responses as invalid", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 401 });

    const result = await validateHuggingFaceToken("hf_bad", fetchMock);

    expect(result).toEqual({ valid: false, error: "Invalid API key", status: 401 });
  });

  it("uses the router-based inference base URL for image models", () => {
    expect(huggingface.imageConfig.baseUrl).toBe(HUGGINGFACE_INFERENCE_BASE_URL);
  });
});
