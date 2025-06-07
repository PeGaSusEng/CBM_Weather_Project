'use client';

import { useEffect, useState } from 'react';

export default function Siaga() {
  const [jamPrediksi, setJamPrediksi] = useState('Memuat...');
  const [jamPrediksiMinus30, setJamPrediksiMinus30] = useState('Memuat...');
  const [probabilitasHujan, setProbabilitasHujan] = useState<number | null>(null);
  const [namaAwan, setNamaAwan] = useState('Memuat...');
  const [statusSiaga, setStatusSiaga] = useState('Memuat...');

  useEffect(() => {
    // Ambil data waktu dari ensemble_plot_data
    fetch('/api/ensemble_plot')
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          const waktuString = data[0].waktu; 
          setJamPrediksi(`${waktuString} WIB`);

          const [jam, menit] = waktuString.split(':').map(Number);
          const original = new Date();
          original.setHours(jam, menit);
          original.setMinutes(original.getMinutes() - 30);
          const jamFix = original.getHours().toString().padStart(2, '0');
          const menitFix = original.getMinutes().toString().padStart(2, '0');
          setJamPrediksiMinus30(`${jamFix}:${menitFix} WIB`);
        }
      });

    // Ambil data cuaca dari prediction/latest
    fetch('/api/latest')
      .then(res => res.json())
      .then(data => {
        const prob = data.probabilitas_hujan;
        setProbabilitasHujan(prob);
        setNamaAwan(data.kategori_awan_dominan?.nama || 'Tidak diketahui');

        // Tentukan status siaga
        if (prob >= 0.5) {
          setStatusSiaga('SIAGA');
        } else {
          setStatusSiaga('NON SIAGA');
        }
      });
  }, []);

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white  rounded-lg">
      <h1 className="text-2xl md:text-3xl font-bold text-blue-700 text-center mb-2">
        INFORMASI KESIAP–SIAGAAN BANJIR DAN HUJAN
      </h1>
      <p className="text-center text-sm md:text-base text-gray-600 mb-6">
        Wilayah Majalaya, Cekungan Bandung, & Sekitarnya
      </p>

      <div className="space-y-2 text-base md:text-lg">
        <p>🕒 Prediksi Hujan: <span className="font-semibold">{jamPrediksi}</span></p>
        <p>🕒 Data Update: <span className="font-semibold">{jamPrediksiMinus30}</span></p>
        <p>🌡️ Probabilitas Hujan: <span className="font-semibold">{probabilitasHujan !== null ? `${(probabilitasHujan * 100).toFixed(1)}%` : 'Memuat...'}</span></p>
        <p>
          🌧️ Status:{' '}
          <span
            className={`font-semibold ${
              statusSiaga === 'SIAGA' ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {statusSiaga}
          </span>
        </p>
        <p>☁️ Awan Terdeteksi: <span className="font-semibold">{namaAwan}</span></p>
      </div>

      <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
        <h2 className="font-bold text-lg mb-2">🧭 Rekomendasi:</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Hindari daerah cekungan</li>
          <li>Siapkan perlindungan hujan</li>
          <li>Ikuti update CBM Weather</li>
        </ul>
      </div>
    </div>
  );
}
