export async function translateText(text, lang) {
  if (lang === "en") return text

  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      target: lang,
    }),
  })

  const data = await res.json()
  return data.translatedText
}
