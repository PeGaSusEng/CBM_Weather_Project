'use client';

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; 
import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import type { ChartOptions } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, ChartDataLabels); // ✅ Daftarkan plugin

type RainData = {
  time: string;
  label: string;
  chance: number;
};

type Props = {
  refreshTrigger: number;
};

export default function GrafikHujan({ refreshTrigger }: Props) {
  const [dataAPI, setDataAPI] = useState<RainData[]>([]);

  useEffect(() => {
    fetch('/api/rain_forecast_series_36')
      .then((res) => res.json())
      .then((data: RainData[]) => setDataAPI(data))
      .catch((err) => console.error('Gagal memuat data:', err));
  }, [refreshTrigger]);

  const labels = dataAPI.map((d) => d.time);
  const hujanData = dataAPI.map((d) => d.label === 'HUJAN' ? d.chance : null);
  const tidakHujanData = dataAPI.map((d) => d.label === 'TIDAK HUJAN' ? d.chance : null);
  const thresholdLine = dataAPI.map(() => 0.5); 

  const chartData = {
    labels,
    datasets: [
      {
        label: 'HUJAN',
        data: hujanData,
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2,
        pointRadius: 3,
        fill: false,
        tension: 0.4,
        spanGaps: true,
      },
      {
        label: 'TIDAK HUJAN',
        data: tidakHujanData,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        pointRadius: 3,
        fill: false,
        tension: 0.4,
        spanGaps: true,
      },
      {
        label: 'AMBANG BATAS HUJAN',
        data: thresholdLine,
        borderColor: 'rgba(104, 25, 25, 0.4)',
        borderDash: [8, 4],
        borderWidth: 1,
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { size: 16 } },
      },
      datalabels: {
        display: false, //
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 1,
        title: {
          display: true,
          text: 'Probabilitas Hujan',
          font: { size: 16, weight: 'bold' },
        },
        ticks: { font: { size: 15 } },
      },
      x: {
        title: {
          display: true,
          text: 'Waktu (WIB)',
          font: { size: 16, weight: 'bold' },
        },
        ticks: { font: { size: 13 } },
      },
    },
  };

  const adaHujan = dataAPI.some((d) => d.label === 'HUJAN');
  const semuaTidakHujan = dataAPI.every((d) => d.label === 'TIDAK HUJAN');

  return (
    <div className="w-full h-[700px] bg-white shadow-lg rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-800 z-20 relative">
        Prediksi Probabilitas Hujan vs Tidak Hujan
      </h2>

      {adaHujan && (
        <div className="absolute top-0 left-0 w-full flex justify-center z-10 pointer-events-none">
          <img
            src="/image/cloud_horizontal.png"
            alt="cloud"
            className="w-[800px] max-w-full h-auto opacity-60 animate-cloud-bounce"
          />
        </div>
      )}

      {adaHujan && (
        <div className="absolute top-24 left-0 w-full h-full z-10 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-[5px] h-[5px] rounded-full animate-rain-dot"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: 'rgba(67, 95, 22, 0.3)',
                boxShadow: '0 0 6px rgba(59, 112, 246, 0.2)',
              }}
            />
          ))}
        </div>
      )}

      {semuaTidakHujan && (
        <div className="absolute top-0 left-0 w-full flex justify-center z-10 pointer-events-none">
          <img
            src="/image/cloud_sun_horizontal.png"
            alt="cerah"
            className="w-[800px] max-w-full h-auto opacity-80 animate-cloud-bounce"
          />
        </div>
      )}

      <div className="flex-1 relative z-20 pb-[72px] sm:pb-[64px] md:pb-[56px] lg:pb-[48px]">
        {dataAPI.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <p className="text-center text-gray-500">Memuat data...</p>
        )}
      </div>
    </div>
  );
}
