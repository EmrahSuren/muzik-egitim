import type { NextApiRequest, NextApiResponse } from 'next';
import { createCompletion } from '@/services/openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const prompt = 'Merhaba, bu bir test mesajıdır. Bana yanıt ver.';
    const response = await createCompletion(prompt);

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}