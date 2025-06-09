import type { NextApiRequest, NextApiResponse } from 'next';

export default async function api_image(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch('http://103.189.235.12:5000/api/image/latest');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(Buffer.from(buffer));
    
  } catch (error) {
    console.error('Gagal fetch gambar:', error);
    res.status(500).json({ error: 'Gagal ambil gambar dari server Flask' });
  }
}
