import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, target } = await req.json();

    if (!text || !target) {
      return NextResponse.json({ translatedText: "" });
    }

    if (target === "en") {
      return NextResponse.json({ translatedText: text });
    }

    const res = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "en",
        target,
        format: "text",
      }),
    });

    const contentType = res.headers.get("content-type") || "";
    const raw = await res.text();

    if (!contentType.includes("application/json")) {
      return NextResponse.json({ translatedText: text });
    }

    const data = JSON.parse(raw);
    return NextResponse.json({ translatedText: data?.translatedText ?? text });
  } catch {
    return NextResponse.json({ translatedText: "" });
  }
}
