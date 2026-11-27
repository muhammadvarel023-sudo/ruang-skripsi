import Link from "next/link";
import { BookOpen, Lock } from "lucide-react";

interface FooterProps {
  brandName: string;
}

export function Footer({ brandName }: FooterProps) {
  return (
    <footer className="border-t border-white/10 bg-[#090E1A] py-12 text-slate-300">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB] text-white">
              <BookOpen className="h-4 w-4" />
            </span>
            <span className="text-sm font-bold text-white">{brandName}</span>
          </div>
          <p className="mt-2.5 max-w-md text-xs leading-relaxed text-slate-400">
            Platform pendampingan, brainstorming, dan evaluasi metodologi penelitian skripsi
            secara terstruktur dan transparan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-slate-400">
          <a href="#layanan" className="hover:text-white transition-colors">
            Katalog Paket
          </a>
          <a href="#cara-kerja" className="hover:text-white transition-colors">
            Alur Pendampingan
          </a>
          <a href="#faq" className="hover:text-white transition-colors">
            FAQ
          </a>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 font-semibold text-white transition-colors hover:bg-[#2563EB] hover:border-[#2563EB]"
          >
            <Lock className="h-3.5 w-3.5" />
            Dashboard Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
