import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Home from "../content/Home";
import Head from 'next/head';

export default function App() {
  return (
    <>
      <Head>
        <title>CBM Weather System | Halaman Utama</title>
        <meta name="description" content="Sistem Prediksi Cuaca Cekungan Bandung dan Majalaya" />
      </Head>
      <div className="min-h-screen flex flex-col overflow-x-hidden overflow-y-hidden bg-[#1155b0]">
        <Navbar />
        <main className="flex-grow">
          <Home/>
        </main>
        <Footer />
      </div>
    </>
  );
}


