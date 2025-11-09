import { useState, useCallback, useEffect } from 'react';
import { ChatMessage, ToolSuggestion } from '../types';
import { sendMessage } from '../lib/claude';
import { logAIMessage, saveMessage, loadConversationHistory, DBChatMessage } from '../lib/supabase';
import { generateId } from '../utils/helpers';
import { toast } from '../components/ui/Toast';

export function useChat(sessionId: string, userId: string, mood?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [toolSuggestion, setToolSuggestion] = useState<ToolSuggestion | undefined>();

  // Load conversation history when session starts
  useEffect(() => {
    const loadHistory = async () => {
      // Only load if we have a valid sessionId
      if (!sessionId) {
        console.log('No sessionId, skipping history load');
        return;
      }

      try {
        const history = await loadConversationHistory(sessionId);

        // Only update if we got messages back
        if (history && history.length > 0) {
          // Convert DB messages to UI messages
          const uiMessages: ChatMessage[] = history.map((dbMsg: DBChatMessage) => ({
            id: dbMsg.id,
            role: dbMsg.role === 'system' ? 'assistant' : dbMsg.role,
            content: dbMsg.content,
            timestamp: new Date(dbMsg.created_at)
          }));

          setMessages(uiMessages);
          console.log(`Loaded ${uiMessages.length} messages from history`);
        } else {
          console.log('No conversation history found');
        }
      } catch (error) {
        console.error('Error loading conversation history:', error);
        // Don't show error to user - just start with empty conversation
      }
    };

    loadHistory();
  }, [sessionId]);

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
      // Save user message to database immediately
      await saveMessage(
        sessionId,
        userId,
        'user',
        userMessage.content
      );

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

      // Save assistant message to database
      await saveMessage(
        sessionId,
        userId,
        'assistant',
        assistantMessage.content,
        suggestion ? { toolSuggestion: suggestion } : undefined
      );

      // Also log to old format for backwards compatibility
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
