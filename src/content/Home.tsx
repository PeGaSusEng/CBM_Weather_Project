'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

const FontLoader = () => (
  <Head>
    <link
      href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap"
      rel="stylesheet"
    />
    <style>{`body { font-family: 'Quicksand', sans-serif; }`}</style>
  </Head>
);

type Prediksi = {
  waktu: string;
  cuaca: string;
  curah_hujan: string;
};

export default function Home() {
  const [data, setData] = useState<Prediksi[]>([]);
  const [tanggalPrediksi, setTanggalPrediksi] = useState<string>('');
  const prevData = useRef<string>('');
  const router = useRouter();

  const [jamPrediksi, setJamPrediksi] = useState('Memuat...');
  const [jamPrediksiMinus30, setJamPrediksiMinus30] = useState('Memuat...');
  const [probabilitasHujan, setProbabilitasHujan] = useState<number | null>(null);
  const [namaAwan, setNamaAwan] = useState('Memuat...');
  const [statusSiaga, setStatusSiaga] = useState('Memuat...');
  const [statusCuaca, setStatusCuaca] = useState('Memuat...');

  const getImageByCuaca = (cuaca: string, waktu: string) => {
    const jam = parseInt(waktu.split(':')[0]);
    const isNight = jam >= 18 || jam < 6;
    const cuacaLower = cuaca.toLowerCase();
    if (cuacaLower === 'hujan') return isNight ? '/logos/hujan_malam.png' : '/logos/hujan_pagi.png';
    if (cuacaLower === 'cerah') return isNight ? '/logos/cerah_malam.png' : '/logos/cerah_pagi.png';
    return '/image/default.png';
  };

  const getCardColor = (cuaca: string) => {
    const lower = cuaca.toLowerCase();
    if (lower === 'hujan') return 'bg-blue-900/70 text-white';
    if (lower === 'cerah') return 'bg-yellow-500/70 text-black';
    return 'bg-gray-500/70 text-white';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/tabel_cuaca_singkat_8');
        const json: Prediksi[] = await res.json();
        const hash = JSON.stringify(json);
        if (prevData.current !== hash) {
          prevData.current = hash;
          setData(json);
        }
      } catch (err) {
        console.error('Gagal fetch data', err);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

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
      } catch {
        setTanggalPrediksi('Gagal memuat tanggal');
      }
    };
    ambilTanggal();
  }, []);

  useEffect(() => {
    const fetchSiaga = async () => {
      try {
        const res1 = await fetch('/api/ensemble_plot');
        const data1 = await res1.json();
        if (data1.length > 0) {
          const waktuString = data1[0].waktu;
          setJamPrediksi(`${waktuString} WIB`);
          const [jam, menit] = waktuString.split(':').map(Number);
          const waktu = new Date();
          waktu.setHours(jam, menit);
          waktu.setMinutes(waktu.getMinutes() - 30);
          setJamPrediksiMinus30(`${waktu.getHours().toString().padStart(2, '0')}:${waktu.getMinutes().toString().padStart(2, '0')} WIB`);
        }

        const res2 = await fetch('/api/latest');
        const data2 = await res2.json();
        const prob = data2.probabilitas_hujan;
        setProbabilitasHujan(prob);
        setNamaAwan(data2.kategori_awan_dominan?.nama || 'Tidak diketahui');
        setStatusCuaca(data2.label || 'Tidak diketahui');
        setStatusSiaga(prob >= 0.5 && data2.label === 'HUJAN' ? 'SIAGA' : 'NON SIAGA');
      } catch (err) {
        console.error('Gagal fetch siaga:', err);
      }
    };
    fetchSiaga();
    const interval = setInterval(fetchSiaga, 5000);
    return () => clearInterval(interval);
  }, []);

  const isSiaga = statusSiaga === 'SIAGA';

  return (
    <>
      <FontLoader />
      <Head>
        <title>CBM-Weather-System</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="relative w-full min-h-screen overflow-y-auto bg-weather bg-cover bg-center px-4 py-2 pt-24 pb-32 flex items-start justify-center">
        <div className="w-full px-2 sm:px-4 flex flex-col items-center justify-start">

          {/* Judul */}
          <div className="text-center mt-14 mb-8 px-4 py-2 bg-black/30 rounded-xl backdrop-blur-sm shadow-md">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-md tracking-wide">
              Prakiraan Cuaca
            </h1>
            <p className="text-white text-base sm:text-lg mt-1 font-medium tracking-wide">
              {tanggalPrediksi}
            </p>
          </div>

          {/* Kartu Prediksi */}
          <AnimatePresence mode="wait">
            <motion.div
              key={JSON.stringify(data)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 justify-items-center gap-4 w-full sm:flex sm:flex-wrap sm:justify-center"
            >
              {data.map((item, index) => {
                const isLastOdd = data.length % 2 === 1 && index === data.length - 1;
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -4 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className={`${getCardColor(item.cuaca)} relative rounded-xl p-5 pb-6 h-[200px] text-center flex flex-col items-center justify-between shadow-lg transition-all backdrop-blur-sm ${
                      isLastOdd ? 'col-span-2 flex justify-center' : 'w-[140px]'
                    } sm:w-[220px]`}
                  >
                    <span className="absolute top-2 right-2 bg-white/90 text-blue-900 text-xs font-semibold px-2 py-1 rounded shadow-md">
                      {item.curah_hujan}
                    </span>
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Image
                        src={getImageByCuaca(item.cuaca, item.waktu)}
                        alt={item.cuaca}
                        width={80}
                        height={80}
                      />
                    </motion.div>
                    <div className="mb-4">
                      <p className="mt-2 text-base">{item.waktu} WIB</p>
                      <p className="font-bold uppercase text-lg">{item.cuaca}</p>
                    </div>
                    <button
                      onClick={() => router.push(`/Page_deteksi_awan`)}
                      className="text-sm text-white bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition"
                    >
                      Detail
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Dua Box: Siaga dan Tentang CBM */}
          <div className="mt-8 w-full flex flex-col lg:flex-row gap-6 justify-center items-stretch max-w-6xl">

            {/* Box Siaga */}
            <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 text-gray-800">
              <h1 className="text-xl md:text-2xl font-bold text-blue-700 text-center mb-1">
                INFORMASI KESIAP–SIAGAAN BANJIR DAN HUJAN
              </h1>
              <p className="text-center text-sm md:text-base text-gray-600 mb-4">
                Wilayah Majalaya, Cekungan Bandung, & Sekitarnya
              </p>
              <div className="space-y-1 text-sm md:text-base text-center">
                <p>🕒 Prediksi: <span className="font-semibold">{jamPrediksi}</span></p>
                <p>🕒 Data Update: <span className="font-semibold">{jamPrediksiMinus30}</span></p>
                <p>🌡️ Probabilitas Hujan: <span className="font-semibold">{probabilitasHujan !== null ? `${(probabilitasHujan * 100).toFixed(1)}%` : 'Memuat...'}</span></p>
                <p>🌧️ Status: <span className={`font-semibold ${isSiaga ? 'text-red-600' : 'text-green-600'}`}>{statusSiaga}</span></p>
                <p>{statusCuaca === 'HUJAN' ? '🌧️' : '🌤️'} Status Cuaca: <span className="font-semibold">{statusCuaca}</span></p>
                <p>☁️ Awan Terdeteksi: <span className="font-semibold">{namaAwan}</span></p>
              </div>
              <div className={`mt-4 p-4 rounded-lg border ${isSiaga ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                <h2 className="font-bold text-base md:text-lg mb-2 text-gray-800 text-center">🧭 Rekomendasi:</h2>
                <ul className={`list-disc list-inside text-sm text-center ${isSiaga ? 'text-red-600' : 'text-green-700'}`}>
                  {isSiaga ? (
                    <>
                      <li>Hindari daerah cekungan</li>
                      <li>Siapkan perlindungan hujan</li>
                      <li>Ikuti update CBM Weather</li>
                    </>
                  ) : (
                    <>
                      <li>Cuaca terpantau aman</li>
                      <li>Selamat beraktivitas</li>
                      <li>Tetap waspada terhadap perubahan cuaca</li>
                    </>
                  )}
                </ul>
              </div>
              <div className="mt-4 text-right">
                <button
                  onClick={() => router.push('/Page_prediksi_hujan')}
                  className="text-sm font-medium text-blue-600 hover:underline hover:text-blue-800 transition"
                >
                  Info selengkapnya...
                </button>
              </div>
            </div>

            
            {/* Box Tentang CBM */}
            <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 flex flex-col items-center justify-center min-h-[460px]">
              <div className="w-full max-w-md text-center">
                {/* Judul */}
                <h2 className="text-xl sm:text-2xl font-extrabold text-blue-800 mb-4 tracking-wide">
                  TENTANG CBM WEATHER SYSTEM
                </h2>

                {/* Gambar GIF */}
                <div className="flex justify-center mb-4">
                  <Image
                    src="/gif/home.gif"
                    alt="CBM Weather Animation"
                    width={440}
                    height={440}
                    className="rounded-xl object-contain"
                  />
                </div>

                {/* Deskripsi */}
                <p className="text-sm sm:text-base leading-relaxed text-gray-800">
                  <span className="font-bold">CBM Weather System</span> adalah sistem prediksi cuaca yang dirancang khusus untuk wilayah <span className="font-bold">Cekungan Bandung dan Majalaya (CBM)</span>.
                  Sistem ini memprediksi cuaca 30 menit lebih awal (lag 30 menit), dan akan terus diperbarui setiap 10 menit agar masyarakat selalu siap menghadapi perubahan cuaca secara real-time.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-10 flex flex-col items-center text-center gap-4">
            <p className="text-white font-semibold text-lg">Download aplikasi CBM untuk Mobile</p>
            <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
              <Image src="/logos/PlayStore.png" alt="Playstore" width={160} height={48} />
            </a>
            <div className="flex gap-6 mt-4">
              <a href="https://www.linkedin.com/in/la-ode-muhammad-abin-akbar/" target="_blank" rel="noopener noreferrer">
                <Image src="/logos/Linkedin.png" alt="LinkedIn" width={32} height={32} />
              </a>
              <a href="https://pegasuseng.github.io/TerminalPromp/" target="_blank" rel="noopener noreferrer">
                <Image src="/logos/Github.png" alt="Github" width={32} height={32} />
              </a>
              <Link href="/Page_final_feedback">
                <Image src="/logos/Feedback.png" alt="Feedback" width={32} height={32} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
