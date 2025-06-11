'use client';

import { useEffect, useState } from 'react';

export default function Siaga() {
  const [jamPrediksi, setJamPrediksi] = useState('Memuat...');
  const [jamPrediksiMinus30, setJamPrediksiMinus30] = useState('Memuat...');
  const [probabilitasHujan, setProbabilitasHujan] = useState<number | null>(null);
  const [namaAwan, setNamaAwan] = useState('Memuat...');
  const [statusSiaga, setStatusSiaga] = useState('Memuat...');
  const [statusCuaca, setStatusCuaca] = useState('Memuat...');

  useEffect(() => {
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

    fetch('/api/latest')
      .then(res => res.json())
      .then(data => {
        const prob = data.probabilitas_hujan;
        setProbabilitasHujan(prob);
        setNamaAwan(data.kategori_awan_dominan?.nama || 'Tidak diketahui');
        setStatusCuaca(data.label || 'Tidak diketahui');

        if (prob >= 0.5 && data.label === 'HUJAN') {
          setStatusSiaga('SIAGA');
        } else {
          setStatusSiaga('NON SIAGA');
        }
      });
  }, []);

  const isSiaga = statusSiaga === 'SIAGA';

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white rounded-lg transition-colors duration-300 text-gray-800">
      <h1 className="text-2xl md:text-3xl font-bold text-blue-700 text-center mb-2">
        INFORMASI KESIAP–SIAGAAN BANJIR DAN HUJAN
      </h1>
      <p className="text-center text-sm md:text-base text-gray-600 mb-6">
        Wilayah Majalaya, Cekungan Bandung, & Sekitarnya
      </p>

      <div className="space-y-2 text-base md:text-lg">
        <p>🕒 Prediksi: <span className="font-semibold">{jamPrediksi}</span></p>
        <p>🕒 Data Update: <span className="font-semibold">{jamPrediksiMinus30}</span></p>
        <p>🌡️ Probabilitas Hujan: <span className="font-semibold">{probabilitasHujan !== null ? `${(probabilitasHujan * 100).toFixed(1)}%` : 'Memuat...'}</span></p>
        <p>
          🌧️ Status:{' '}
          <span className={`font-semibold ${isSiaga ? 'text-red-600' : 'text-green-600'}`}>
            {statusSiaga}
          </span>
        </p>
        <p>
          {statusCuaca === 'HUJAN' ? '🌧️' : '🌤️'} Status Cuaca:{' '}
          <span className="font-semibold">{statusCuaca}</span>
        </p>
        <p>☁️ Awan Terdeteksi: <span className="font-semibold">{namaAwan}</span></p>
      </div>

      {/* ✅ Box rekomendasi dengan background dinamis */}
      <div
        className={`mt-6 p-4 rounded-lg border transition-colors duration-300 ${
          isSiaga ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
        }`}
      >
        <h2 className="font-bold text-lg mb-2 text-gray-800">🧭 Rekomendasi:</h2>
        {isSiaga ? (
          <ul className="list-disc pl-6 space-y-1 text-red-600">
            <li>Hindari daerah cekungan</li>
            <li>Siapkan perlindungan hujan</li>
            <li>Ikuti update CBM Weather</li>
          </ul>
        ) : (
          <ul className="list-disc pl-6 space-y-1 text-green-700">
            <li>Cuaca terpantau aman.</li>
            <li>Selamat beraktivitas.</li>
            <li>Tetap waspada terhadap perubahan cuaca.</li>
          </ul>
        )}
      </div>
    </div>
  );
}
