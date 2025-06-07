import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Prediksi_Hujan from "../content/prediksi_hujan/Prediksi_hujan"
import Head from "next/head";

export default function Page_Prediksi_hujan() {
  return (
    <>
      <Head>
        <title>CBM-Prediksi Hujan</title>
        <meta name="description" content="Sistem Prediksi Cuaca Cekungan Bandung dan Majalaya" />
      </Head>
      <div className="min-h-screen flex flex-col overflow-x-hidden overflow-y-hidden bg-white">
        <Navbar />
        <main className="flex-grow">
          <Prediksi_Hujan/>
        </main>
        <Footer />
      </div>
    </>
  );
}
