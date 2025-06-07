const nx = 19;
const ny = 19;

// Deteksi jam lokal WIB (offset +7)
const wibTime = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
const hour = wibTime.getHours();

// Siang: 6–17 → arah keluar; Malam: 18–5 → arah ke pusat
const isSiang = hour >= 6 && hour < 18;

const uData: number[] = [];
const vData: number[] = [];

const cx = (nx - 1) / 2;
const cy = (ny - 1) / 2;

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
        la1: -6.92,
        lo1: 107.58,
        la2: -7.28,
        lo2: 107.94,
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
        la1: -6.92,
        lo1: 107.58,
        la2: -7.28,
        lo2: 107.94,
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
