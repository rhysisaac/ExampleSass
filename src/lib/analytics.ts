import { readEnv } from "@/lib/env";

export async function track(
  event: string,
  payload: Record<string, unknown> = {},
  distinctId = "anonymous"
) {
  if (!event) {
    throw new Error("Event is required");
  }

  const env = readEnv();
  const captureUrl = `${env.NEXT_PUBLIC_POSTHOG_HOST.replace(/\/$/, "")}/capture/`;
  const timeoutMs = 1500;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(captureUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      signal: controller.signal,
      body: JSON.stringify({
        api_key: env.NEXT_PUBLIC_POSTHOG_KEY,
        event,
        distinct_id: distinctId,
        properties: payload
      })
    });

    if (!response.ok) {
      console.error("[analytics] failed to send event", { event, status: response.status });
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("[analytics] capture timeout", { event, timeoutMs });
      return;
    }
    console.error("[analytics] capture error", error);
  } finally {
    clearTimeout(timeoutId);
  }
}
