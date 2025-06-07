'use client';

import { useEffect, useState } from 'react';

type EnsembleData = {
  waktu: string;
  model: string;
  hujan: number;
  tidak_hujan: number;
};

type Props = {
  refreshTrigger: number;
}

export default function AnalisisModel({refreshTrigger}: Props) {
  const [data, setData] = useState<EnsembleData[]>([]);
  const [analisis, setAnalisis] = useState<React.ReactNode>('Memuat analisis...');

  useEffect(() => {
    fetch('/api/ensemble_plot')
      .then((res) => res.json())
      .then((json: EnsembleData[]) => {
        setData(json);
        generateAnalisis(json);
      })
      .catch((err) => console.error('Gagal fetch data:', err));
  }, [refreshTrigger]);

  const generateAnalisis = (data: EnsembleData[]) => {
    if (data.length === 0) return;

    const waktu = data[0].waktu;
    const rata2Hujan = data.reduce((sum, d) => sum + d.hujan, 0) / data.length;
    const persenHujan = (rata2Hujan * 100).toFixed(1);

    let tingkat = '';
    if (rata2Hujan < 0.05) {
      tingkat = 'kemungkinan hujan sangat kecil';
    } else if (rata2Hujan < 0.2) {
      tingkat = 'kemungkinan hujan rendah';
    } else if (rata2Hujan < 0.5) {
      tingkat = 'kemungkinan hujan sedang';
    } else {
      tingkat = 'kemungkinan hujan tinggi';
    }

    setAnalisis(
      <div>
        <p className="font-semibold">Prediksi Cuaca Pukul {waktu} WIB</p>
        <p className="mt-1">
          Berdasarkan 4 model cuaca yang dikembangkan menggunakan metode{' '}
          <em>Convolutional Neural Network (CNN)</em>, {tingkat}, dengan peluang hujan rata-rata sekitar{' '}
          <strong>{persenHujan}%</strong>.
        </p>
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6 bg-white rounded-xl text-gray-800">
      <div className="text-base md:text-lg leading-relaxed">{analisis}</div>
    </div>
  );
}
