export interface GeneratedCard {
  front: string;
  back: string;
}

export class ClaudeApiError extends Error {}

/**
 * Calls the Anthropic API directly from the browser using the user's own
 * API key (stored locally, never sent anywhere else). This relies on the
 * `anthropic-dangerous-direct-browser-access` header, which Anthropic
 * requires precisely because it exposes the key in the browser's network
 * traffic — acceptable here since this app runs only locally for a single
 * user, but never deploy this build publicly with a key embedded.
 */
export async function generateFlashcardsFromNote(
  apiKey: string,
  model: string,
  noteTitle: string,
  noteContent: string,
  count = 8,
): Promise<GeneratedCard[]> {
  if (!apiKey.trim()) {
    throw new ClaudeApiError(
      "Aucune clé API définie. Ajoute ta clé Anthropic dans Réglages.",
    );
  }

  const prompt = `À partir de la note de cours ci-dessous, génère jusqu'à ${count} flashcards de révision.
Chaque flashcard doit porter sur un fait, une définition ou un concept précis à mémoriser.
Les questions doivent être claires et autonomes (compréhensibles sans relire la note).
Réponds UNIQUEMENT avec un tableau JSON valide, sans aucun texte autour, au format :
[{"front": "question", "back": "réponse"}, ...]

Titre: ${noteTitle}

Note:
${noteContent}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model,
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new ClaudeApiError(
      `Erreur API Claude (${res.status}): ${body.slice(0, 300)}`,
    );
  }

  const data = await res.json();
  const text: string = data?.content?.[0]?.text ?? "";
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) {
    throw new ClaudeApiError(
      "Réponse inattendue du modèle : impossible d'en extraire des flashcards.",
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(match[0]);
  } catch {
    throw new ClaudeApiError("Le JSON renvoyé par le modèle est invalide.");
  }

  if (!Array.isArray(parsed)) {
    throw new ClaudeApiError("Format de réponse inattendu.");
  }

  return parsed
    .filter(
      (item): item is GeneratedCard =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as GeneratedCard).front === "string" &&
        typeof (item as GeneratedCard).back === "string",
    )
    .map((item) => ({ front: item.front.trim(), back: item.back.trim() }))
    .filter((item) => item.front && item.back);
}
