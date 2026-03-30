export async function generateNewQuestions(topic, mode) {
  const prompts = {
    vignette: `Generate 2 new CFA Level II vignettes for the topic: ${topic}.
    Each vignette needs:
    - title: string
    - caseText: 2-3 sentence case scenario
    - questions: array of 4 questions each with:
      - text: question string
      - options: array of 4 answer strings
      - correctAnswer: index 0-3
      - explanation: string
    Return ONLY a valid JSON array of 2 vignette objects. No markdown, no explanation, just JSON.`,

    suddenDeath: `Generate 8 new CFA Level II multiple choice questions for the topic: ${topic}.
    Each question needs:
    - text: question string
    - options: array of 4 answer strings
    - correctAnswer: index 0-3
    - explanation: string
    Return ONLY a valid JSON array of 8 question objects. No markdown, no explanation, just JSON.`,

    flashcard: `Generate 8 new CFA Level II flashcards for the topic: ${topic}.
    Each flashcard needs:
    - term: string
    - definition: string (2-4 sentences)
    Return ONLY a valid JSON array of 8 flashcard objects. No markdown, no explanation, just JSON.`,
  }

  const response = await fetch('/.netlify/functions/generate-questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, mode, prompt: prompts[mode] }),
  })

  const data = await response.json()
  const text = data.content[0].text
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}
