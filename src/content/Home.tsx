import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import Head from "next/head";
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
  const [tanggalPrediksi, setTanggalPrediksi] = useState<string>("");
  const prevData = useRef<string>("");
  const router = useRouter();

  const getImageByCuaca = (cuaca: string, waktu: string) => {
    const jam = parseInt(waktu.split(":")[0]);
    const isNight = jam >= 18 || jam < 6;
    const cuacaLower = cuaca.toLowerCase();

    if (cuacaLower === "hujan") {
      return isNight ? "/logos/hujan_malam.png" : "/logos/hujan_pagi.png";
    }
    if (cuacaLower === "cerah") {
      return isNight ? "/logos/cerah_malam.png" : "/logos/cerah_pagi.png";
    }
    return "/image/default.png";
  };

  const getCardColor = (cuaca: string) => {
    const lower = cuaca.toLowerCase();
    if (lower === "hujan") return "bg-blue-900/70 text-white";
    if (lower === "cerah") return "bg-yellow-500/70 text-black";
    return "bg-gray-500/70 text-white";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/tabel_cuaca_singkat_8");
        const json: Prediksi[] = await res.json();
        const hash = JSON.stringify(json);
        if (prevData.current !== hash) {
          prevData.current = hash;
          setData(json);
        }
      } catch (err) {
        console.error("Gagal fetch data", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ambilTanggal = async () => {
      try {
        const res = await fetch("/api/latest");
        const data = await res.json();

        const tanggal = new Date(data.timestamp.split("T")[0]);
        const formatIndonesia = tanggal.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });

        setTanggalPrediksi(formatIndonesia);
      } catch (error) {
        console.error("Gagal fetch tanggal:", error);
        setTanggalPrediksi("Gagal memuat tanggal");
      }
    };

    ambilTanggal();
  }, []);

  return (
    <>
      <FontLoader />
      <Head>
        <title>CBM-Weather-System</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="relative w-full min-h-screen overflow-y-auto bg-weather bg-cover bg-center px-4 py-2 pt-24 pb-32 flex items-start justify-center">
        <div className="w-full px-2 sm:px-4 flex flex-col items-center justify-start">

          {/* Judul dan Tanggal */}
          <div className="text-center mt-14 mb-8 px-4 py-2 bg-black/30 rounded-xl backdrop-blur-sm shadow-md">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-md tracking-wide">
              Prakiraan Cuaca
            </h1>
            <p className="text-white text-base sm:text-lg mt-1 font-medium tracking-wide">
              {tanggalPrediksi}
            </p>
          </div>

          {/* Kartu Prediksi - Responsif dan Rapi */}
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
                      isLastOdd
                        ? 'col-span-2 flex justify-center'
                        : 'w-[140px]'
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
                      onClick={() => router.push(`/Page_prediksi_hujan`)}
                      className="text-sm text-white bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition"
                    >
                      Detail
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>


          {/* Tentang CBM */}
          <div className="bg-white/90 text-gray-900 rounded-xl px-6 py-5 mt-8 w-full max-w-xl text-center text-sm leading-snug shadow-md">
            <h2 className="text-xl font-bold mb-2 leading-tight">
              TENTANG CBM WEATHER SYSTEM
            </h2>
            <p>
              <span className="font-bold">CBM Weather System</span> adalah sistem prediksi cuaca yang dirancang khusus untuk wilayah <span className="font-bold">Cekungan Bandung dan Majalaya (CBM)</span> .
              Sistem ini memprediksi cuaca 30 menit lebih awal (lag 30 menit), dan akan terus diperbarui setiap 10 menit 
              agar masyarakat selalu siap menghadapi perubahan cuaca secara real-time.
            </p>
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
                <Image src="/logos/Github.png" alt="Instagram" width={32} height={32} />
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
