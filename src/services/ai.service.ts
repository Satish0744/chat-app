import axios from 'axios';
import { env } from '../config/env';

interface AIChatRequest {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

interface AIChatResponse {
  message: string;
  context?: string;
}

export const aiService = {
  chat: async (messages: AIChatRequest['messages']): Promise<AIChatResponse> => {
    const response = await axios.post(
      `${env.aiApiUrl}/chat/completions`,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant in a chat application. Keep responses concise and friendly.',
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          'Authorization': `Bearer ${env.aiApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      message: response.data.choices[0].message.content,
      context: response.data.choices[0].message.content,
    };
  },

  generateSuggestion: async (context: string): Promise<string[]> => {
    const response = await axios.post(
      `${env.aiApiUrl}/chat/completions`,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Generate 3 relevant reply suggestions based on the context. Return as comma-separated list.',
          },
          {
            role: 'user',
            content: context,
          },
        ],
        temperature: 0.8,
        max_tokens: 100,
      },
      {
        headers: {
          'Authorization': `Bearer ${env.aiApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content.split(',').map((s: string) => s.trim());
  },

  summarizeChat: async (messages: string[]): Promise<string> => {
    const response = await axios.post(
      `${env.aiApiUrl}/chat/completions`,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Summarize the following conversation in 2-3 sentences.',
          },
          {
            role: 'user',
            content: messages.join('\n'),
          },
        ],
        temperature: 0.5,
        max_tokens: 100,
      },
      {
        headers: {
          'Authorization': `Bearer ${env.aiApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  },
};