'use client';

import { useEffect, useState } from 'react';

type CuacaData = {
  waktu: string;
  cuaca: string;
  curah_hujan: string;
};

type Props = {
  refreshTrigger: number;
}
export default function TabelHujanPrediction({ refreshTrigger }: Props) {
  const [data, setData] = useState<CuacaData[]>([]);

  useEffect(() => {
    fetch('http://103.189.235.12:5000/api/json/tabel_cuaca_singkat36')
      .then((res) => res.json())
      .then((json: CuacaData[]) => setData(json))
      .catch((err) => console.error('Gagal mengambil data:', err));
  }, [refreshTrigger]);

  const getImageByCuaca = (cuaca: string, waktu: string) => {
    const jam = parseInt(waktu.split(':')[0]);
    const isNight = jam >= 18 || jam < 6;
    const cuacaLower = cuaca.toLowerCase();

    if (cuacaLower === 'hujan') {
      return isNight ? '/logos/hujan_malam.png' : '/logos/hujan_pagi.png';
    }
    if (cuacaLower === 'cerah') {
      return isNight ? '/logos/cerah_malam.png' : '/logos/cerah_pagi.png';
    }
    return '/image/default.png';
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-4 text-center text-gray-800">
        Tabel Prediksi Cuaca
      </h2>

      <div className="overflow-y-auto max-h-96 border rounded-lg">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-blue-500 text-white sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 border">Waktu</th>
              <th className="px-4 py-2 border">Cuaca</th>
              <th className="px-4 py-2 border">Curah Hujan</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx} className="text-center hover:bg-gray-50">
                <td className="px-4 py-2 border">{item.waktu}</td>
                <td className="px-4 py-2 border">
                  <div className="flex flex-col items-center justify-center">
                    <img
                      src={getImageByCuaca(item.cuaca, item.waktu)}
                      alt={item.cuaca}
                      className="w-8 h-8 mb-1 animate-float"
                    />
                    <span className="text-sm">{item.cuaca}</span>
                  </div>
                </td>
                <td className="px-4 py-2 border">{item.curah_hujan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
