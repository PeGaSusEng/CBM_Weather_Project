const nx = 19;
const ny = 19;

// Koordinat Majalaya (pusat radial)
const latMajalaya = -7.05;
const lonMajalaya = 107.73;

// Koordinat grid dari header (diambil dari metadata)
const la1 = -6.92, lo1 = 107.58, la2 = -7.28, lo2 = 107.94;

function getLatLon(i:number, j:number) {
  const lat = la1 + (la2 - la1) * (j / (ny - 1));
  const lon = lo1 + (lo2 - lo1) * (i / (nx - 1));
  return { lat, lon };
}

// Cari grid terdekat dengan Majalaya
let minDist = 1e9;
let cx = 0, cy = 0;
for (let j = 0; j < ny; j++) {
  for (let i = 0; i < nx; i++) {
    const { lat, lon } = getLatLon(i, j);
    const dist = Math.sqrt(Math.pow(lat - latMajalaya, 2) + Math.pow(lon - lonMajalaya, 2));
    if (dist < minDist) {
      minDist = dist;
      cx = i;
      cy = j;
    }
  }
}

// Deteksi jam lokal WIB (offset +7)
const wibTime = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
const hour = wibTime.getHours();

// Siang: 6–17 → arah keluar; Malam: 18–5 → arah ke pusat
const isSiang = hour >= 6 && hour < 18;

const uData = [];
const vData = [];

for (let j = 0; j < ny; j++) {
  for (let i = 0; i < nx; i++) {
    const dx = i - cx;
    const dy = j - cy;
    const distance = Math.sqrt(dx * dx + dy * dy) + 0.001;
    const speed = 1.0 + 0.5 * Math.sin(distance / 2);

    const u = (isSiang ? dx : -dx) / distance * speed;
    const v = (isSiang ? dy : -dy) / distance * speed;

    uData.push(parseFloat(u.toFixed(2)));
    vData.push(parseFloat(v.toFixed(2)));
  }
}

const windDataExample = {
  data: [
    {
      header: {
        parameterUnit: 'm.s-1',
        parameterNumber: 2,
        dx: 0.02,
        dy: 0.02,
        la1,
        lo1,
        la2,
        lo2,
        nx,
        ny,
        refTime: wibTime.toISOString(),
        parameterNumberName: 'Eastward wind',
        parameterCategory: 2,
      },
      data: uData,
    },
    {
      header: {
        parameterUnit: 'm.s-1',
        parameterNumber: 3,
        dx: 0.02,
        dy: 0.02,
        la1,
        lo1,
        la2,
        lo2,
        nx,
        ny,
        refTime: wibTime.toISOString(),
        parameterNumberName: 'Northward wind',
        parameterCategory: 2,
      },
      data: vData,
    },
  ],
};

export default windDataExample;
