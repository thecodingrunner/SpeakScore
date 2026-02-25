import { Mic } from "lucide-react";
import Link from "next/link";

const Footer = () => {
    return (
      <footer className="footer footer-center p-10 bg-base-200 text-base-content">
        <div>
          <div className="flex items-center gap-2 font-bold text-xl mb-2">
            <Mic className="w-6 h-6 text-primary" />
            SpeakScore
          </div>
          <p className="opacity-70">AI-powered pronunciation coach for Japanese English learners</p>
          <p className="text-sm opacity-60 mt-1">日本人英語学習者のためのAI発音コーチ</p>
        </div>
        <div>
          <div className="grid grid-flow-col gap-4">
            <Link href="/about" className="link link-hover">About</Link>
            <Link href="/blog" className="link link-hover">Blog</Link>
            <Link href="/practice" className="link link-hover">Practice</Link>
            <Link href="/pricing" className="link link-hover">Pricing</Link>
            <Link href="/privacy" className="link link-hover">Privacy</Link>
            <Link href="/terms" className="link link-hover">Terms</Link>
            <Link href="/contact" className="link link-hover">Contact</Link>
          </div>
        </div>
        <div>
          <div className="flex flex-wrap justify-center gap-2 text-xs opacity-60 mb-2">
            <span>TOEIC準備</span>
            <span>•</span>
            <span>TOEFL対策</span>
            <span>•</span>
            <span>ビジネス英語</span>
            <span>•</span>
            <span>発音矯正</span>
          </div>
          <p className="text-sm opacity-60">© 2026 SpeakScore. All rights reserved.</p>
        </div>
      </footer>
    )
}

export default Footer;