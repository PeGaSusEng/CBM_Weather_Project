'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PetaCBM = dynamic(() => import('./components/Peta_weather'), { ssr: false });
const GrafikAwan = dynamic(() => import('./components/Grafik_awan'), { ssr: false });
const TabelAwan = dynamic(() => import('./components/Tabel_awan'), { ssr: false });
const Legend_awan = dynamic(() => import('./components/Legenda_awan'), { ssr: false });
const Videoawan = dynamic(()=> import('./components/video'), { ssr: false});

export default function FuncDeteksiAwan() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [tanggalPrediksi, setTanggalPrediksi] = useState<string>('Memuat...');
  const router = useRouter();
  const [showVideo, setShowVideo] = useState(false);

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

          {/* Tombol Aksi: Refresh & Lihat Data Awan */}
          <div className="mt-10 flex flex-col items-center justify-center gap-3">
            <div className="flex flex-row gap-x-8">
              {/* Tombol Lihat Data Awan */}
              <button
                onClick={() => setShowVideo(true)}
                className="text-sm md:text-base px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md transition shadow"
              >
                🛰️
              </button>
              {showVideo && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
                  {/* Overlay blur */}
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9998]" />

                  {/* Modal Video */}
                  <div className="relative z-[9999]">
                    <Videoawan onClose={() => setShowVideo(false)} refreshTrigger={refreshKey} />
                  </div>
                </div>
              )}
              {/* Tombol Refresh */}
              <button
                onClick={handleRefresh}
                className="text-2xl px-4 py-2 bg-blue-900 hover:bg-blue-700 text-white font-bold rounded-md transition shadow"
              >
                🔁
              </button>
            </div>

            <div className="flex flex-row gap-4 text-sm text-gray-700">
              <span>Citra awan terbaru dari satelit</span>
              <span>•</span>
              <span>Klik 🔁 untuk memuat ulang</span>
            </div>
          </div>

          {/* Legenda dan Deskripsi */}
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
                  Peta memperlihatkan kondisi perkiraan cuaca dari model, sedangkan tabel menunjukkan hasil klasifikasi citra awan. Kecepatan angin yang ditampilkan bersumber dari data simulasi angin lokal permukaan, bukan observasi langsung.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
