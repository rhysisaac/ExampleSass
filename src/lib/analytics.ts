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

  try {
    const response = await fetch(captureUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
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
    console.error("[analytics] capture error", error);
  }
}
