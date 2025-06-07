'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 

export default function FeedbackForm() {
  const router = useRouter(); 

  const [formData, setFormData] = useState({
    nama: '',
    asal: '',
    question_1: '',
    question_2: '',
    question_3: '',
    question_4: '',
    question_5: '',
    question_6: '',
    kritik_saran: '',
  });

  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('http://103.189.235.12:5000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccessMessage('✅ Terima kasih atas feedback-nya!');
      } else {
        setSuccessMessage('❌ Gagal mengirim feedback. Silakan coba lagi.');
      }
    } catch (err) {
      console.error(err);
      setSuccessMessage('❌ Terjadi kesalahan saat mengirim. Periksa koneksi Anda.');
    }
  };

  const asalOptions = ['Banjaran', 'Arjasari', 'Baleendah','Dayeuhkolot','Kertasari',
    ,'Pacet','Majalaya','Bojongsoang','Rancasari','Buahbatu','Gedebage','Cileunyi',
    'Jatinangor','Cimanggung','Cicalengka','Rancaekek','Solokanjeruk','Ibun','Pasirwangi',
    'Sukaresmi','Samarang','Tarogong Kidul','Tarogong Kaler','Leles','Paseh','Cikancung',
    'Nagreg','Kadungora','Lainnya'];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Form Feedback CBM Weater System</h2>

      {successMessage ? (
        <div className="text-center">
          <p className="text-green-600 text-xl font-medium mb-6">{successMessage}</p>

          {/* Tombol kembali ke halaman utama */}
          <button
            onClick={() => router.push('/App')} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Kembali ke Halaman Utama
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama */}
          <div>
            <label className="block font-medium mb-1">Nama</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>

          {/* Asal */}
          <div>
            <label className="block font-medium mb-1">Asal</label>
            <select
              name="asal"
              value={formData.asal}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            >
              <option value="">Pilih asal</option>
              {asalOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Pertanyaan 1–6 */}
          {([
            ['question_1', '1. Bagaimana pendapat Anda tentang tampilan website CBM?', ['Sangat Baik', 'Baik', 'Cukup', 'Kurang']],
            ['question_2', '2. Apakah informasi cuaca yang ditampilkan mudah dipahami?', ['Sangat Mudah', 'Mudah', 'Sulit', 'Sangat Sulit']],
            ['question_3', '3. Seberapa akurat prediksi cuaca menurut Anda?', ['Sangat Akurat', 'Cukup Akurat', 'Kurang Akurat', 'Tidak Akurat']],
            ['question_4', '4. Bagaimana performa kecepatan akses sistem saat digunakan?', ['Cepat', 'Cukup Cepat', 'Lambat']],
            ['question_5', '5. Seberapa sering Anda akan menggunakan sistem ini?', ['Setiap Hari', 'Beberapa Kali Seminggu', 'Kadang-kadang', 'Jarang']],
            ['question_6', '6. Apakah ada saran fitur baru yang ingin Anda lihat di sistem ini?', ['Ya, sangat dibutuhkan', 'Ya, bisa ditambahkan', 'Tidak perlu']],
          ] as [string, string, string[]][]).map(([name, label, options]) => (
            <div key={name}>
              <label className="block font-medium mb-1">{label}</label>
              <select
                name={name}
                value={formData[name as keyof typeof formData]}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                required
              >
                <option value="">Pilih jawaban</option>
                {options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}

          {/* Kritik & Saran */}
          <div>
            <label className="block font-medium mb-1">Kritik & Saran</label>
            <textarea
              name="kritik_saran"
              value={formData.kritik_saran}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Kirim 
          </button>
        </form>
      )}
    </div>
  );
}
