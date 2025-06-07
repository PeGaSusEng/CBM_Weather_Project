'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const Grafik_rain_series = dynamic(() => import('./components/Grafik_rain_series_36entry'), { ssr: false });
const Tabel_rain_prediction = dynamic(() => import('./components/Tabel_rain_prediction_36entry'), { ssr: false });
const Tabel_yes_No = dynamic(() => import('./components/Tabel_Yes_No_36entry'), { ssr: false });
const EnsamblePlot = dynamic(() => import('./components/Plot_Ensemble_series'), { ssr: false });
const Analisis_CNN = dynamic(() => import('./components/Analisis_model'), { ssr: false });
const Siaga_info = dynamic(()=>import('./components/info_siaga'), { ssr: false});

export default function FuncPrediksiHujan() {
  const [tanggalPrediksi, setTanggalPrediksi] = useState<string>('Memuat...');
  const [showModel, setShowModel] = useState(false);
  const [showAnalisisCNN, setShowAnalisisCNN] = useState(false);
  const [showInfo , setShowInfo] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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
    <>
      <div className="min-h-screen bg-gray-50 text-gray-800 px-4 pt-32 pb-10 flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Prediksi Hujan <span className="font-black">{tanggalPrediksi}</span>
        </h1>

        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_2.5fr_1fr] gap-6 items-stretch">
          {/* KIRI */}
          <div className="flex flex-col h-full">
            <div className="mb-4 overflow-x-auto shadow-lg">
              <Tabel_rain_prediction refreshTrigger={refreshKey} />
            </div>
            <button
              onClick={() => setShowInfo(true)}
              className="bg-blue-900 text-white text-center px-4 py-4 rounded-xl flex-1 flex items-center justify-center hover:bg-blue-800 transition font-semibold text-sm md:text-base leading-relaxed"
            >
              INFORMASI MENGENAI KESIAP – SIAGAAN BANJIR DAN HUJAN
            </button>
          </div>

          {/* TENGAH */}
          <div className="flex flex-col w-full h-full">
            <Grafik_rain_series key={refreshKey} refreshTrigger={refreshKey} />
          </div>

          {/* KANAN */}
          <div className="flex flex-col justify-between h-full">
            <div className="mb-4 overflow-x-auto shadow-lg">
              <Tabel_yes_No refreshTrigger={refreshKey} />
            </div>
            <div className="flex flex-col gap-4">
              {["ANALISIS MODEL", "PREDIKSI BMKG", "ENSEMBLE PLOT", "REFRESH"].map((label, i) => (
                <button
                  key={i}
                  className="bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800 transition text-sm sm:text-base"
                  onClick={() => {
                    if (label === 'ENSEMBLE PLOT') setShowModel(true);
                    if (label === 'ANALISIS MODEL') setShowAnalisisCNN(true);
                    if (label === 'REFRESH') handleRefresh();
                    if (label === 'PREDIKSI BMKG') window.open('https://www.bmkg.go.id/cuaca/prakiraan-cuaca.bmkg', '_blank');
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* === Modal ENSEMBLE PLOT === */}
      {showModel && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9998]"></div>
          <div className="relative bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl z-[9999]">
            <button
              onClick={() => setShowModel(false)}
              className="absolute top-4 right-4 text-pink-600 text-xl font-bold hover:scale-125 z-[10000]"
            >
              ❌
            </button>
            <h2 className="text-xl font-bold text-center mb-4">ENSEMBLE PLOT</h2>
            <div className="w-full">
              <EnsamblePlot refreshTrigger={refreshKey} />
            </div>
          </div>
        </div>
      )}

      {/* === Modal ANALISIS CNN === */}
      {showAnalisisCNN && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9998]" />
          <div className="relative bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl z-[9999]">
            <button
              onClick={() => setShowAnalisisCNN(false)}
              className="absolute top-4 right-4 text-pink-600 text-xl font-bold hover:scale-125 z-[10000]"
            >
              ❌
            </button>
            <h2 className="text-xl font-bold text-center mb-4">ANALISIS MODEL</h2>
            <div className="text-center text-gray-700">
              <Analisis_CNN refreshTrigger={refreshKey} />
            </div>
          </div>
        </div>
      )}

      {/* === Model INFO BANJIR & HUJAN === */}
      {showInfo && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9998]" />
          <div className="relative bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl z-[9999]">
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-4 right-4 text-pink-600 text-xl font-bold hover:scale-125 z-[10000]"
            >
              ❌
            </button>
            <div className="text-gray-700 text-sm leading-relaxed space-y-3">
              <Siaga_info/>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
