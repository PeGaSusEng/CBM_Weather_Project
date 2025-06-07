'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type EnsembleData = {
  waktu: string;
  model: string;
  hujan: number;
  tidak_hujan: number;
};

type Props = {
  refreshTrigger: number;
}

export default function EnsamblePlot({ refreshTrigger }: Props) {
  const [data, setData] = useState<EnsembleData[]>([]);

  useEffect(() => {
    fetch('/api/ensemble_plot')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error('Gagal memuat data ensambel:', err));
  }, [refreshTrigger]);

  const chartData = {
    labels: data.map((d) => d.model),
    datasets: [
      {
        label: 'Hujan',
        data: data.map((d) => d.hujan),
        backgroundColor: 'rgba(59, 130, 246, 0.7)', // biru
      },
      {
        label: 'Tidak Hujan',
        data: data.map((d) => d.tidak_hujan),
        backgroundColor: 'rgba(234, 179, 8, 0.7)', // kuning
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1.3,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.parsed.y;
            return `${context.dataset.label}: ${(value * 100).toFixed(2)}%`;
          },
        },
        bodyFont: {
          size: 13,
        },
        titleFont: {
          size: 14,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        title: {
          display: true,
          text: 'Probabilitas (%)',
          font: {
            size: 14,
            weight : 'bold'
          },
        },
        ticks: {
          callback: function (tickValue: string | number) {
            const value = typeof tickValue === 'number' ? tickValue : parseFloat(tickValue);
            return `${(value * 100).toFixed(0)}%`;
          },
          font: {
            size: 13,
          },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Model',
          font: {
            size: 14,
            weight: 'bold'
          },
        },
        ticks: {
          font: {
            size: 13,
          },
        },
      },
    },
  };

  return (
    <div className="w-full">
      <div className="w-full min-h-[260px] sm:min-h-[320px] md:min-h-[400px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
