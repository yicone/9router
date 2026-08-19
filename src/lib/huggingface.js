export const HUGGINGFACE_WHOAMI_URL = "https://huggingface.co/api/whoami-v2";
export const HUGGINGFACE_INFERENCE_BASE_URL = "https://router.huggingface.co/hf-inference/models";

export async function validateHuggingFaceToken(apiKey, fetchImpl = fetch) {
  const res = await fetchImpl(HUGGINGFACE_WHOAMI_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
  });

  const valid = res.ok;
  return {
    valid,
    error: valid ? null : "Invalid API key",
    status: res.status,
  };
}
