import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface RequestBody {
  messages: ChatMessage[]
  systemPrompt: string
}

// Detect tool suggestions from response text
function detectToolSuggestion(text: string): { tool: string; reason: string } | null {
  const lowerText = text.toLowerCase()

  if (lowerText.includes('breathing') || lowerText.includes('breathe') || lowerText.includes('breath')) {
    return { tool: 'breathing', reason: 'Suggested by Luma' }
  }
  if (lowerText.includes('movement') || lowerText.includes('move') || lowerText.includes('stretch') || lowerText.includes('shake')) {
    return { tool: 'movement', reason: 'Suggested by Luma' }
  }
  if (lowerText.includes('affirmation') || lowerText.includes('remind yourself') || lowerText.includes('kind words') || lowerText.includes('positive')) {
    return { tool: 'affirmation', reason: 'Suggested by Luma' }
  }

  return null
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')

    if (!geminiApiKey) {
      console.error('[Gemini Text] Missing GEMINI_API_KEY')
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body: RequestBody = await req.json()
    const { messages, systemPrompt } = body

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Convert messages to Gemini format
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined,
          contents,
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.8,
          }
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('[Gemini Text] API error:', response.status, errorData)
      return new Response(
        JSON.stringify({ error: `Gemini API error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()

    // Extract text from response
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    if (!reply) {
      console.error('[Gemini Text] Empty response from Gemini')
      return new Response(
        JSON.stringify({ error: 'Empty response from Gemini' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Detect tool suggestions
    const toolSuggestion = detectToolSuggestion(reply)

    return new Response(
      JSON.stringify({ reply, toolSuggestion }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[Gemini Text] Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
