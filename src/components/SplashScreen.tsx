import Image from "next/image";

export default function SplashScreen() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white"
      style={{
        background: "radial-gradient(circle at center, #009be2 0%, #5353a5 100%)"
      }}
    >
      <div className="mb-6">
        <Image
          src="/logos/logo.png"
          alt="Logo CBM"
          width={390}
          height={390}
          priority 
        />
      </div>
      <div className="w-12 h-12 border-4 border-yellow-300 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );
}


