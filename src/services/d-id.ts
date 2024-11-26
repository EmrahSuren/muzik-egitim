import axios from 'axios';

const DID_API_KEY = process.env.NEXT_PUBLIC_DID_API_KEY;

export const d_idService = {
  async startStream(gender: string, message: string): Promise<void> {
    try {
      const response = await axios.post(
        'https://api.d-id.com/v1/some-endpoint', // D-ID API endpoint
        {
          gender,
          message,
        },
        {
          headers: {
            'Authorization': `Bearer ${DID_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('D-ID API response:', response.data);
    } catch (error) {
      console.error('D-ID API error:', error);
      throw new Error('D-ID API error');
    }
  },

  async sendNewText(message: string): Promise<void> {
    try {
      const response = await axios.post(
        'https://api.d-id.com/v1/some-endpoint', // D-ID API endpoint
        {
          message,
        },
        {
          headers: {
            'Authorization': `Bearer ${DID_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('D-ID API response:', response.data);
    } catch (error) {
      console.error('D-ID API error:', error);
      throw new Error('D-ID API error');
    }
  },

  async disconnect(): Promise<void> {
    try {
      const response = await axios.post(
        'https://api.d-id.com/v1/some-endpoint', // D-ID API endpoint
        {},
        {
          headers: {
            'Authorization': `Bearer ${DID_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('D-ID API response:', response.data);
    } catch (error) {
      console.error('D-ID API error:', error);
      throw new Error('D-ID API error');
    }
  },
};