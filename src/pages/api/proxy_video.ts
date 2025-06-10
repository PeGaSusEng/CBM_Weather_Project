// src/pages/api/proxy_video.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const timestamp = req.query.ts;

  try {
    const videoResponse = await fetch(`http://103.189.235.12:5000/api/video?ts=${timestamp}`);

    if (!videoResponse.ok) {
      res.status(videoResponse.status).send('Gagal mengambil video dari server backend');
      return;
    }

    const buffer = await videoResponse.arrayBuffer();
    res.setHeader('Content-Type', 'video/mp4');
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).send('Internal server error saat memuat video');
  }
}
