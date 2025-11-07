import { useState, useCallback } from 'react';
import { ChatMessage, ToolSuggestion } from '../types';
import { sendMessage } from '../lib/claude';
import { logAIMessage } from '../lib/supabase';
import { generateId } from '../utils/helpers';
import { toast } from '../components/ui/Toast';

export function useChat(sessionId: string, userId: string, mood?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [toolSuggestion, setToolSuggestion] = useState<ToolSuggestion | undefined>();

  const sendUserMessage = useCallback(async (content: string) => {
    if (!content.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const { reply, toolSuggestion: suggestion } = await sendMessage(
        [...messages, userMessage],
        mood
      );

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: reply,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setToolSuggestion(suggestion);

      // Log to database
      await logAIMessage(
        sessionId,
        userId,
        userMessage.content,
        assistantMessage.content,
        suggestion?.tool ?? undefined
      );
    } catch (error: any) {
      console.error('Chat error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [messages, loading, sessionId, userId, mood]);

  const clearToolSuggestion = useCallback(() => {
    setToolSuggestion(undefined);
  }, []);

  return {
    messages,
    loading,
    toolSuggestion,
    sendUserMessage,
    clearToolSuggestion
  };
}
