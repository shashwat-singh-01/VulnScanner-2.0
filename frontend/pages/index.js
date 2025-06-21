// pages/index.js or pages/index.tsx
import ScannerRadar from "../components/ScannerRadar";
import ParticlesBackground from "../components/ParticlesBackground";
import ScannerForm from "../components/ScannerForm";
import Footer from "../components/Footer";
import SocialIcons from "../components/SocialIcons";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0f1d] text-white relative">
      {/* Social icons */}
      <SocialIcons />

      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ScannerRadar />
        <ParticlesBackground />
      </div>

      {/* Foreground */}
      <main className="relative z-10 flex-grow">
        <ScannerForm />
      </main>

      
    </div>
  );
}
