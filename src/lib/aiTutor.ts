export interface AIMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export async function sendChatMessage(messages: AIMessage[]): Promise<string> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data.message
  } catch (error) {
    console.error("AI Tutor Error:", error)
    return "Oops! I couldn't understand that right now. Let's try again."
  }
}
