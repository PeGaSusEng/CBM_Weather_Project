'use client';

import { useRouter } from 'next/navigation';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';

import '@react-pdf-viewer/core/lib/styles/index.css';

export default function PDFfiles() {
  const router = useRouter();

  const zoomPluginInstance = zoomPlugin();
  const pageNavPluginInstance = pageNavigationPlugin();

  const { ZoomInButton, ZoomOutButton } = zoomPluginInstance;
  const { CurrentPageLabel } = pageNavPluginInstance;

  return (
    <div className="w-screen min-h-screen bg-white">
      {/* Spacer agar tidak menabrak navbar */}
      <div className="mt-24 px-4 flex justify-between items-center">
        <button
          onClick={() => router.push('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          ← Kembali
        </button>

        <a
          href="/pdf/test.pdf"
          download
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          ⬇ Unduh PDF
        </a>
      </div>

      {/* Kontainer PDF */}
      <div className="relative w-full h-[calc(100vh-8rem)] mt-6">
        <div className="fixed bottom-4 right-4 z-[9999] flex gap-2 items-center bg-white px-3 py-2 rounded shadow text-sm">
          <ZoomOutButton />
          <ZoomInButton />
          <CurrentPageLabel />
        </div>

        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <div className="w-full h-full">
            <Viewer
              fileUrl="/pdf/PDF_CBM.pdf"
              plugins={[zoomPluginInstance, pageNavPluginInstance]}
              defaultScale={SpecialZoomLevel.PageWidth}
            />
          </div>
        </Worker>
      </div>
    </div>
  );
}
