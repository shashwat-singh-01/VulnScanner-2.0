import { Github, Linkedin, Instagram } from "lucide-react";

export default function SocialIcons() {
  return (
    <div className="fixed right-2 top-1/2 -translate-y-1/2 z-50">
      <div className="backdrop-blur-md bg-[#1a2332]/40 border border-[#2a3441] px-3 py-4 rounded-l-xl flex flex-col items-center space-y-6">
      <a
        href="https://github.com/shashwat-singh-01"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white glow-blue"
        title="GitHub"
      >
        <Github size={32} strokeWidth={2.2} />
      </a>
      <a
        href="https://www.linkedin.com/in/shashwat-singh01/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white glow-blue"
        title="LinkedIn"
      >
        <Linkedin size={32} strokeWidth={2.2} />
      </a>
      <a
        href="https://www.instagram.com/shashwat_singh.01/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white glow-blue"
        title="LinkedIn"
      >
        <Instagram size={32} strokeWidth={2.2} />
      </a>
      </div>
    </div>
  );
}
