'use client';

import React, { useState } from 'react';

export const OpenAITest: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async () => {
    if (!userInput) return;

    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userInput }),
      });

      if (!res.ok) {
        throw new Error(`HTTP hata kodu: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error('API error:', error);
      setResponse('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">OpenAI Test</h1>
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        placeholder="Bir şey yazın..."
        className="p-2 border rounded mb-4 w-full"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Yükleniyor...' : 'Gönder'}
      </button>
      {response && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h2 className="text-xl font-bold mb-2">Yanıt</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};