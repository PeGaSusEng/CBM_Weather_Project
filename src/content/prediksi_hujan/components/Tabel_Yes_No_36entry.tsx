'use client';

import { useEffect, useState } from 'react';

type HujanData = {
  waktu: string;
  hujan: string;
};

type Props =  {
  refreshTrigger: number;
}
export default function Tabel_Yes_No_36_Series( {refreshTrigger}: Props) {
  const [data, setData] = useState<HujanData[]>([]);

  useEffect(() => {
    fetch('/api/tabel_Yes_No_36')
      .then((res) => res.json())
      .then((json: HujanData[]) => setData(json))
      .catch((err) => console.error('Gagal mengambil data:', err));
  }, [refreshTrigger]);

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-4 text-center text-gray-800">
        Tabel Status Hujan
      </h2>

      <div className="overflow-y-auto max-h-96 border rounded-lg">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-blue-500 text-white sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 border">Waktu</th>
              <th className="px-4 py-2 border">Hujan</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx} className="text-center hover:bg-gray-50">
                <td className="px-4 py-2 border">{item.waktu.replace('.', ':')}</td>
                <td className="px-4 py-2 border">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${
                      item.hujan.toLowerCase() === 'yes'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-green-100 text-green-600'
                    }`}
                  >
                    {item.hujan === 'Yes' ? 'Yes' : 'No'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
