
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function api_cloud_series_36entry(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch('http://103.189.235.12:5000/api/json/plot_cloud_series_36entry');
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Gagal fetch prediksi:', error);
    res.status(500).json({ error: 'Gagal ambil data dari server Flask' });
  }
}
