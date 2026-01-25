import { Sparkles } from "lucide-react";
import Link from "next/link";

const Footer = () => {
    return (
      <footer className="footer footer-center p-10 bg-base-200 text-base-content">
        <div>
          <div className="flex items-center gap-2 font-bold text-xl mb-2">
            <Sparkles className="w-6 h-6 text-primary" />
            ProfileAI
          </div>
          <p className="opacity-70">AI-powered dating profile optimization</p>
        </div>
        <div>
          <div className="grid grid-flow-col gap-4">
            <Link href="/about" className="link link-hover">About</Link>
            <Link href="/privacy" className="link link-hover">Privacy</Link>
            <Link href="/terms" className="link link-hover">Terms</Link>
            <Link href="/contact" className="link link-hover">Contact</Link>
          </div>
        </div>
        <div>
          <p className="text-sm opacity-60">© 2026 ProfileAI. All rights reserved.</p>
        </div>
      </footer>
    )
}

export default Footer;