// components/global/Footer.tsx
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { MascotMini } from '@/components/global/Mascot';

const Footer = () => {
  return (
    <footer className="bg-base-200 border-t border-base-content/5">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Top */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2.5 mb-3">
            <MascotMini size={28} />
            <span className="text-lg font-extrabold text-base-content">
              Speak<span className="text-primary">Score</span>
            </span>
          </div>
          <p className="text-sm text-base-content/50 text-center">
            AI-powered pronunciation coach for Japanese English learners
          </p>
          <p className="text-xs text-base-content/35 font-jp mt-1">
            日本人英語学習者のためのAI発音コーチ
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8">
          {[
            { href: '/about', label: 'About' },
            { href: '/practice', label: 'Practice' },
            { href: '/#pricing', label: 'Pricing' },
            { href: '/privacy', label: 'Privacy' },
            { href: '/terms', label: 'Terms' },
            { href: '/contact', label: 'Contact' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-base-content/45 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-2 text-xs text-base-content/30 mb-6 font-jp">
          {['TOEIC準備', 'TOEFL対策', 'ビジネス英語', '発音矯正'].map((tag, i) => (
            <span key={i} className="px-2.5 py-1 bg-base-content/4 rounded-full">{tag}</span>
          ))}
        </div>

        {/* Bottom */}
        <div className="text-center text-xs text-base-content/30">
          <p className="flex items-center justify-center gap-1.5">
            Made with <Heart className="w-3 h-3 text-primary fill-primary" /> for Japanese learners
          </p>
          <p className="mt-1">© {new Date().getFullYear()} SpeakScore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;