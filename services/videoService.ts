// services/videoService.ts
const BASE_URL = 'https://api.d-id.com';

interface VideoGenerationProps {
  text: string;
  gender: 'male' | 'female';
}

export const generateVideo = async ({ text, gender }: VideoGenerationProps) => {
  // Örnek avatar URL'leri (D-ID'nin desteklediği bir URL olmalı)
  const avatars = {
    male: "https://create-images-results.d-id.com/DefaultPresenters/Emma_f/image.jpeg",
    female: "https://create-images-results.d-id.com/DefaultPresenters/William_m/image.jpeg"
  };

  try {
    const response = await fetch(`${BASE_URL}/talks`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${process.env.D_ID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        script: {
          type: 'text',
          input: text,
          provider: {
            type: 'microsoft',
            voice_id: gender === 'male' ? 'tr-TR-AhmetNeural' : 'tr-TR-EmelNeural'
          }
        },
        source_url: avatars[gender],
        config: {
          stitch: true,
        }
      }),
    });

    const data = await response.json();
    
    // Video ID'sini al ve video hazır olana kadar bekle
    const videoId = data.id;
    return await waitForVideo(videoId);

  } catch (error) {
    console.error('Error generating video:', error);
    throw error;
  }
};

const waitForVideo = async (videoId: string) => {
  let status = 'created';
  
  while (status !== 'done') {
    const response = await fetch(`${BASE_URL}/talks/${videoId}`, {
      headers: {
        'Authorization': `Basic ${process.env.D_ID_API_KEY}`,
      },
    });

    const data = await response.json();
    status = data.status;

    if (status === 'error') {
      throw new Error('Video generation failed');
    }

    if (status !== 'done') {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Video URL'sini döndür
  return data.result_url;
};