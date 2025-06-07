import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Deteksi_awan from "../content/deteksi_awan/Deteksi_awan";
import Head from "next/head";


export default function Page_Deteksi_awan() {
  return (
    <>
      <Head>
        <title>CBM-Deteksi Awan</title>
        <meta name="description" content="Sistem Prediksi Cuaca Cekungan Bandung dan Majalaya" />
      </Head>
      <div className="min-h-screen flex flex-col overflow-x-hidden overflow-y-hidden bg-white">
        <Navbar />
        <main className="flex-grow">
          <Deteksi_awan/>
        </main>
        <Footer />
      </div>
    </>
  );
}
