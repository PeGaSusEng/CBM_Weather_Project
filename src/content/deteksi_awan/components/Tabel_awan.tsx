'use client';

import { useEffect, useState } from 'react';

type CloudData = {
  time: string;
  kode: string;
  jenis: string;
  deskripsi: string;
};

type Props = {
  refreshTrigger: number;
};

export default function TabelAwan({ refreshTrigger }: Props) {
  const [data, setData] = useState<CloudData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        '/api/plot_cloud_series_8entry'
      );
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Gagal fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]); 

  if (loading) return <p className="text-center py-4">Memuat data...</p>;

  return (
    <div className="overflow-x-auto p-4 w-full">
      <table className="min-w-full divide-y divide-gray-200 shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold">Waktu</th>
            <th className="px-4 py-2 text-center text-sm font-semibold">Jenis Awan</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Deskripsi</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100 text-gray-700">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="px-4 py-2">{item.time}</td>

              <td className="px-4 py-2 text-center">
                <div className="flex flex-col items-center">
                  <img
                    src="/logos/berawan.png"
                    alt={`Gambar ${item.jenis}`}
                    className="w-12 h-12 object-cover rounded mb-1"
                  />
                  <span className="text-sm">{item.jenis}</span>
                </div>
              </td>

              <td className="px-4 py-2">{item.deskripsi}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
