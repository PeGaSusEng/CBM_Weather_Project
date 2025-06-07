'use client';

export default function Legenda_awan() {
  const legenda = [
    { warna: 'rgba(220,38,38,1)', label: 'Awan Cumulonimbus (CB)' }, // merah
    { warna: 'rgba(13,14,202,1)', label: 'Langit Cerah' },           // biru custom
    { warna: 'rgba(0,0,0,1)', label: 'Awan Tipis' },                 // hitam
    {
      warna: 'linear-gradient(to right, rgba(220,38,38,1), rgba(13,14,202,1), rgba(0,0,0,1))',
      label: 'Awan Kombinasi',
      isGradient: true,
    },
  ];

  return (
    <div className="w-full max-w-xs">
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-lg ">
        <h2 className="text-base font-semibold mb-3 text-center">
          Legenda Awan
        </h2>
        <ul className="space-y-3">
          {legenda.map((item, index) => (
            <li key={index} className="flex items-center space-x-3">
              <div
                className="w-8 h-4 rounded-sm border border-gray-400"
                style={
                  item.isGradient
                    ? { backgroundImage: item.warna }
                    : { backgroundColor: item.warna }
                }
              ></div>
              <span className="text-sm">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
