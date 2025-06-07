
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function api_tabel_cuaca_singkat_36(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch('http://103.189.235.12:5000/api/json/tabel_cuaca_singkat36');
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Gagal fetch prediksi:', error);
    res.status(500).json({ error: 'Gagal ambil data dari server Flask' });
  }
}
