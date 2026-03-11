import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    
    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.warn("No OPENAI_API_KEY found. Returning mock response.")
      return NextResponse.json({ 
        message: "Hello! I am your AI teacher. (Mock response: Please add your OPENAI_API_KEY to .env)" 
      })
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Cost efficient model perfect for simple language
        messages: [
          {
            role: "system",
            content: "You are a friendly, patient English teacher. You are currently talking to an A1 beginner. Keep your responses extremely simple, short (1-2 sentences max), and encouraging. Use vocabulary related to greetings and introductions."
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 150,
      }),
    })

    if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenAI API Error", errorText);
        return NextResponse.json(
          { error: "Failed to fetch from OpenAI" },
          { status: response.status }
        );
    }

    const data = await response.json()
    return NextResponse.json({ message: data.choices[0].message.content })

  } catch (error) {
    console.error("Chat API Route Error", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
