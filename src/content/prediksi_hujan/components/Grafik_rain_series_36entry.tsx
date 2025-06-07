'use client';

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Ticks,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import type { ChartOptions } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

//  Type untuk data API
type RainData = {
  time: string;
  label: string;
  chance: number;
  tipe: 'lampau' | 'sekarang';
};

type Props = {
  refreshTrigger: number;
}

export default function GrafikHujan({ refreshTrigger }: Props) {
  const [dataAPI, setDataAPI] = useState<RainData[]>([]);

  useEffect(() => {
    fetch('/api/rain_forecast_series_36')
      .then((res) => res.json())
      .then((data: RainData[]) => setDataAPI(data))
      .catch((err) => console.error('Gagal memuat data:', err));
  }, [refreshTrigger]);

  const lampau = dataAPI.filter((d) => d.tipe === 'lampau');
  const sekarang = dataAPI.filter((d) => d.tipe === 'sekarang');

  const labels = dataAPI.map((d) => d.time);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Lampau',
        data: lampau.map((d) => d.chance),
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        pointRadius: 3,
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Sekarang',
        data: [
          ...Array(lampau.length).fill(null),
          ...sekarang.map((d) => d.chance),
        ],
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        pointRadius: 3,
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        position: 'top',
        labels: {
        font: {
          size: 16, 
        },
      },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min : 0,
        max : 1,
        title: {
          display: true,
          text: 'Probabilitas Hujan',
          font : {
            size : 16,
            weight : 'bold'
          },
        },
        ticks : {
          font : {
            size : 15,
          },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Waktu (WIB)',
          font : {
            size : 16,
            weight : 'bold',
          },
        },
        ticks : {
          font : {
            size : 13,
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-[700px] bg-white shadow-lg rounded-2xl p-4 flex flex-col justify-between">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
        Grafik Prediksi Hujan
      </h2>
      <div className="flex-1 relative">
        {dataAPI.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <p className="text-center text-gray-500">Memuat data...</p>
        )}
      </div>
    </div>
  );

}

