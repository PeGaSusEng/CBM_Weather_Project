'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const PetaCBM = dynamic(() => import('./components/Peta_weather'), { ssr: false });
const GrafikAwan = dynamic(() => import('./components/Grafik_awan'), { ssr: false });
const TabelAwan = dynamic(() => import('./components/Tabel_awan'), { ssr: false });
const Legend_awan = dynamic(() => import('./components/Legenda_awan'), { ssr: false });

export default function FuncDeteksiAwan() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [tanggalPrediksi, setTanggalPrediksi] = useState<string>('Memuat...');

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    const ambilTanggal = async () => {
      try {
        const res = await fetch('/api/latest');
        const data = await res.json();
        const tanggal = new Date(data.timestamp.split('T')[0]);
        const formatIndonesia = tanggal.toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        });
        setTanggalPrediksi(formatIndonesia);
      } catch (error) {
        console.error('Gagal fetch tanggal:', error);
        setTanggalPrediksi('Gagal memuat tanggal');
      }
    };

    ambilTanggal();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 px-4 pt-32 pb-24 flex flex-col items-center">
      {/* Judul */}
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
        Deteksi Awan <span className="font-black">{tanggalPrediksi}</span>
      </h1>

      {/* Layout utama */}
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-6 items-start">
        {/* Kiri: Grafik dan Tabel */}
        <div className="flex flex-col gap-4 w-full lg:w-[40%]">
          <GrafikAwan key={refreshKey} refreshTrigger={refreshKey} />
          <TabelAwan refreshTrigger={refreshKey} />
        </div>

        {/* Kanan: Peta */}
        <div className="w-full lg:w-[60%] flex flex-col items-center">
          <div className="relative w-full h-[500px] rounded-xl shadow-black/50 shadow-lg overflow-hidden bg-white z-10">
            <PetaCBM refreshTrigger={refreshKey} />
          </div>

          {/* Tombol Refresh di Tengah */}
          <div className="mt-10 flex flex-col items-center justify-center">
            <button
              onClick={handleRefresh}
              className="text-2xl px-5 py-3 bg-blue-900 hover:bg-blue-600 text-white font-bold rounded-lg transition"
            >
              🔁
            </button>
            <span className="text-sm text-gray-700 mt-2">
              Klik di sini untuk memuat ulang
            </span>
          </div>

          {/* Baris: Legenda dan Box */}
          {/* Legenda dan Deskripsi sejajar dan tinggi sama */}
          <div className="mt-8 w-full flex flex-col lg:flex-row gap-6 items-stretch">
            {/* Legenda Awan */}
            <div className="flex-1">
              <div className="h-full bg-white p-4 rounded-lg shadow-lg flex flex-col justify-center">
                <Legend_awan />
              </div>
            </div>

            {/* Box Deskripsi */}
            <div className="flex-1">
              <div className="h-full bg-gray-100 p-4 rounded-xl shadow-inner text-gray-700 text-sm text-justify leading-relaxed flex items-center mb-18 shadow-lg">
                <p>
                  Peta memperlihatkan kondisi perkiraan cuaca dari model, sedangkan tabel menunjukkan hasil klasifikasi citra awan. Kecepatan angin yang ditampilkan bersumber dari data simulasi, bukan observasi langsung.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
