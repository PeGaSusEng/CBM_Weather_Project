import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Hanya mendukung POST request' });
  }

  try {
    const response = await fetch('http://103.189.235.12:5000/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)  
    });

    const result = await response.json();  
    res.status(200).json(result);
  } catch (error) {
    console.error('Gagal kirim feedback:', error);
    res.status(500).json({ error: 'Gagal mengirim feedback ke server Flask' });
  }
}
