export const OPENAI_CONFIG = {
  model: 'gpt-3.5-turbo-instruct',
  baseUrl: 'https://api.openai.com/v1',
  temperature: 0.7,
  maxTokens: 150,
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''
} as const;

export enum OpenAIModel {
  GPT35Turbo = 'gpt-3.5-turbo',
  GPT35TurboInstruct = 'gpt-3.5-turbo-instruct'
}