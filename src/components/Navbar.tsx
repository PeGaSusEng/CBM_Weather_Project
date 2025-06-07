import { useState } from "react";
import Image from "next/image";
import Link from "next/link"; 

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 text-white px-6 py-4 rounded-b-3xl font-semibold"
      style={{
        background: "radial-gradient(circle at center, #009be2 0%, #5353a5 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/logos/logo.png"
            alt="Logo CBM"
            width={60}
            height={60}
            className="w-[60px] h-auto"
          />
          <span className="text-xl hidden sm:inline">CBM Weather System</span>
        </div>

        {/* Menu (desktop) */}
        <div className="hidden md:flex space-x-10 text-lg tracking-wide">
          <Link href="/" className="hover:underline">HOME</Link>
          <Link href="/Page_deteksi_awan" className="hover:underline">DETEKSI AWAN</Link>
          <Link href="/Page_prediksi_hujan" className="hover:underline">PREDIKSI HUJAN</Link>
          <Link href="/Page_panduan" className="hover:underline">PANDUAN</Link>
        </div>

        {/* Hamburger menu (mobile) */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Dropdown menu (mobile) */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col space-y-3 text-center text-base">
          <Link href="/" className="hover:underline">HOME</Link>
          <Link href="/Page_deteksi_awan" className="hover:underline">DETEKSI AWAN</Link>
          <Link href="/Page_prediksi_hujan" className="hover:underline">PREDIKSI HUJAN</Link>
          <Link href="/Page_panduan" className="hover:underline">PANDUAN</Link>
        </div>
      )}
    </nav>
  );
}


