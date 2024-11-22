import type { NextApiRequest, NextApiResponse } from 'next';
import { openAIServiceInstance } from '@/services/openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Yalnızca POST istekleri kabul edilir' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt eksik' });
  }

  try {
    const response = await openAIServiceInstance.getResponse(prompt);
    res.status(200).json({ response });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ message: 'OpenAI API error' });
  }
}