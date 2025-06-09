'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Filler,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';


ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Filler);


const jenisAwanList = [
  'Awan Tipis',
  'Langit Cerah',
  'Cumulonimbus',
  'Awan Campuran',
];


const colorMap = [
  '#60A5FA', // Awan Tipis
  '#34D399', // Langit Cerah
  '#F87171', // Cumulonimbus
  '#A78BFA', // Awan Campuran
];

type DataAwan = {
  time: string;    
  jenis: string;   
};

type PointXY = { x: string; y: number }; 
type Props = {
  refreshTrigger: number;
};

export default function GrafikAwan({ refreshTrigger }: Props) {
  const [dataAwan, setDataAwan] = useState<DataAwan[]>([]);

  useEffect(() => {
    fetch('/api/plot_cloud_series_36entry')
      .then((res) => res.json())
      .then((data: DataAwan[]) => {
        const dataFiltered = data.filter((d) => d.jenis !== 'Tidak Teridentifikasi');
        setDataAwan(dataFiltered);
      })
      .catch((err) => {
        console.error('Gagal memuat data awan:', err);
      });
  }, [refreshTrigger]);

  const dataPoints: PointXY[] = dataAwan
    .map((item) => {
      const y = jenisAwanList.indexOf(item.jenis);
      if (y === -1) return null;
      return { x: item.time, y };
    })
    .filter(Boolean) as PointXY[];

  const chartData: ChartData<'line', PointXY[]> = {
    datasets: [
      {
        label: 'Jenis Awan',
        data: dataPoints,
        backgroundColor: dataPoints.map((pt) => colorMap[pt.y]),
        borderColor: '#10B981',
        borderWidth: 2,
        showLine: true,
        pointRadius: 6,
        tension: 0.3,
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      title: {
        display: false,
        font: {
          size: 18, 
        },
      },
      tooltip: {
        callbacks: {
          label: function (ctx) {
            const point = ctx.raw as PointXY;
            return `Jenis: ${jenisAwanList[point.y]} pada ${point.x}`;
          },
        },
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 14,
        },
      },
      datalabels: {
        display: false, 
      },
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Waktu (WIB)',
          font: {
            size: 12,
            weight: 'bold',
          },
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        type: 'linear',
        min: 0,
        max: jenisAwanList.length - 1,
        ticks: {
          stepSize: 1,
          callback: function (value: unknown) {
            const v = Number(value);
            return jenisAwanList[v] || '';
          },
          font: {
            size: 10,
          },
        },
        title: {
          display: true,
          text: 'Jenis Awan',
          font: {
            size: 13,
            weight: 'bold',
          },
        },
      },
    },
  };
  return (
    <div className="p-4 bg-white rounded-xl shadow-lg w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-6 text-center">Distribusi Jenis Awan terhadap Waktu</h2>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}
