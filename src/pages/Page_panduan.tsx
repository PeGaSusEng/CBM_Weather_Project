import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PDFview from "../content/panduan/Panduan_pdf"
import Head from "next/head";

export default function Page_Panduan() {
  return (
    <>
      <Head>
        <title>CBM-Panduan</title>
        <meta name="description" content="Sistem Prediksi Cuaca Cekungan Bandung dan Majalaya" />
      </Head>
      <div className="min-h-screen flex flex-col overflow-x-hidden overflow-y-hidden">
        <Navbar />
        <main className="flex-grow">
          <PDFview/>
        </main>
        <Footer />
      </div>
    </>
  );
}
