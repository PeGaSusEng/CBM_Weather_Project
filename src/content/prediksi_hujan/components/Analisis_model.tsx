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

    const totalHujan = data.reduce((sum, d) => sum + d.hujan, 0);
    const totalTidakHujan = data.reduce((sum, d) => sum + d.tidak_hujan, 0);
    const rataHujan = totalHujan / data.length;
    const rataTidakHujan = totalTidakHujan / data.length;

    const persenHujan = (rataHujan * 100).toFixed(1);
    const persenTidakHujan = (rataTidakHujan * 100).toFixed(1);

    const jumlahModelHujan = data.filter(d => d.hujan > d.tidak_hujan).length;

    let klasifikasi = '';
    if (jumlahModelHujan === 4 && rataHujan > 0.8) {
      klasifikasi = 'kemungkinan hujan sangat tinggi';
    } else if (jumlahModelHujan >= 3 && rataHujan > 0.5) {
      klasifikasi = 'kemungkinan hujan tinggi';
    } else if (jumlahModelHujan === 2) {
      klasifikasi = 'kemungkinan hujan sedang';
    } else if (jumlahModelHujan === 1 && rataHujan < 0.3) {
      klasifikasi = 'kemungkinan hujan rendah';
    } else {
      klasifikasi = 'kemungkinan besar tidak hujan';
    }

    setAnalisis(
      <div>
        <p className="font-semibold">Prediksi Cuaca Pukul {waktu} WIB</p>
        <p className="mt-1">
          Berdasarkan 4 model cuaca yang dikembangkan menggunakan metode{' '}
          <em>Convolutional Neural Network (CNN)</em>, {klasifikasi}.{' '}
          <br />
          <span className="block mt-2">
            Rata-rata peluang <strong>HUJAN</strong>: {persenHujan}% <br />
            Rata-rata peluang <strong>TIDAK HUJAN</strong>: {persenTidakHujan}% <br />
            Jumlah model memprediksi HUJAN: <strong>{jumlahModelHujan} dari 4 model</strong>
          </span>
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
