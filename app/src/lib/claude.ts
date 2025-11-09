import Anthropic from '@anthropic-ai/sdk';
import { ChatMessage, ToolSuggestion } from '../types';

const client = new Anthropic({
  apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
  dangerouslyAllowBrowser: true // Only for MVP, move to Edge Function later
});

export async function sendMessage(
  messages: ChatMessage[],
  mood?: string
): Promise<{ reply: string; toolSuggestion?: ToolSuggestion }> {
  const systemPrompt = `You are the "Regulation Buddy," a warm, emotionally intelligent AI guide helping children (ages 5-12) understand and regulate their feelings.

TONE: Calm, encouraging, safe, playful but not overly childish.

RULES:
- Use simple words (avoid jargon)
- Keep responses under 3 sentences
- Always validate feelings first
- Offer tools when appropriate
- Never give medical advice
- If child seems distressed, gently suggest talking to a trusted adult

TOOLS AVAILABLE:
- Breathing: For anxiety, overwhelm, anger
- Movement: For restlessness, sadness, tension
- Affirmation: For low confidence, worry, negative self-talk

CURRENT MOOD: ${mood || 'not specified'}

When suggesting a tool, respond with: "Would you like to try [tool name] together?"`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    system: systemPrompt,
    messages: messages.map(m => ({
      role: m.role,
      content: m.content
    }))
  });

  const textContent = response.content.find(c => c.type === 'text');
  const reply = textContent && 'text' in textContent ? textContent.text : '';

  // Simple tool detection (enhance with Claude function calling later)
  const toolSuggestion = detectToolSuggestion(reply);

  return { reply, toolSuggestion };
}

function detectToolSuggestion(text: string): ToolSuggestion | undefined {
  const lower = text.toLowerCase();
  if (lower.includes('breathing') || lower.includes('breathe')) {
    return { tool: 'breathing', reason: 'Suggested by AI' };
  }
  if (lower.includes('movement') || lower.includes('move') || lower.includes('stretch')) {
    return { tool: 'movement', reason: 'Suggested by AI' };
  }
  if (lower.includes('affirmation') || lower.includes('remind yourself')) {
    return { tool: 'affirmation', reason: 'Suggested by AI' };
  }
  return undefined;
}
