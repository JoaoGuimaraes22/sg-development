import { GoogleAuth } from "google-auth-library";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId, locale } = await req.json();

    if (!message || !sessionId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const rawCreds = process.env.GOOGLE_CREDENTIALS;
    const projectId = process.env.DIALOGFLOW_PROJECT_ID;

    if (!rawCreds)
      return NextResponse.json(
        { error: "GOOGLE_CREDENTIALS not set" },
        { status: 500 },
      );
    if (!projectId)
      return NextResponse.json(
        { error: "DIALOGFLOW_PROJECT_ID not set" },
        { status: 500 },
      );

    const credentials = JSON.parse(rawCreds);

    const auth = new GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });
    const token = await auth.getAccessToken();

    if (!token) {
      console.error("[chat] Failed to get access token");
      return NextResponse.json({ error: "Auth failed" }, { status: 500 });
    }

    const url = `https://dialogflow.googleapis.com/v2/projects/${projectId}/agent/sessions/${sessionId}:detectIntent`;
    const dfRes = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        queryInput: {
          text: {
            text: message,
            languageCode: locale === "pt" ? "pt-PT" : "en",
          },
        },
      }),
    });

    if (!dfRes.ok) {
      const errBody = await dfRes.text();
      console.error("[chat] Dialogflow error:", dfRes.status, errBody);
      return NextResponse.json(
        { error: "Dialogflow error", detail: errBody },
        { status: 500 },
      );
    }

    const data = await dfRes.json();
    const reply =
      data.queryResult?.fulfillmentText ||
      (locale === "pt"
        ? "Desculpe, não compreendi."
        : "Sorry, I didn't understand that.");

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[chat] Unhandled error:", err);
    return NextResponse.json(
      { reply: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
