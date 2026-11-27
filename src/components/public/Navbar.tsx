"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, ArrowUpRight, Menu, X } from "lucide-react";

interface NavbarProps {
  brandName: string;
  onOpenMatcher: () => void;
}

export function Navbar({ brandName, onOpenMatcher }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm"
          : "bg-[#090E1A] border-b border-white/10"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-[0_4px_14px_rgba(37,99,235,0.4)] transition-transform duration-300 group-hover:scale-105">
            <BookOpen className="h-4 w-4" strokeWidth={2.2} />
          </span>
          <div className="flex flex-col leading-none">
            <span
              className={`text-[15px] font-bold tracking-tight transition-colors ${
                scrolled ? "text-[#090E1A]" : "text-white"
              }`}
            >
              {brandName}
            </span>
            <span
              className={`text-[11px] font-medium transition-colors ${
                scrolled ? "text-slate-500" : "text-blue-200/80"
              }`}
            >
              Pendampingan Akademik
            </span>
          </div>
        </Link>

        <nav
          className={`hidden items-center gap-7 text-sm font-medium md:flex transition-colors ${
            scrolled ? "text-slate-600" : "text-slate-300"
          }`}
        >
          <a
            href="#layanan"
            className={`transition-colors ${
              scrolled ? "hover:text-[#2563EB]" : "hover:text-white"
            }`}
          >
            Katalog Paket
          </a>
          <a
            href="#cara-kerja"
            className={`transition-colors ${
              scrolled ? "hover:text-[#2563EB]" : "hover:text-white"
            }`}
          >
            Alur Pendampingan
          </a>
          <a
            href="#prinsip"
            className={`transition-colors ${
              scrolled ? "hover:text-[#2563EB]" : "hover:text-white"
            }`}
          >
            Etika Akademik
          </a>
          <a
            href="#faq"
            className={`transition-colors ${
              scrolled ? "hover:text-[#2563EB]" : "hover:text-white"
            }`}
          >
            FAQ
          </a>
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          <button
            type="button"
            onClick={onOpenMatcher}
            className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
              scrolled
                ? "border-slate-300 bg-white text-slate-800 hover:border-[#2563EB] hover:text-[#2563EB]"
                : "border-white/20 bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Bantu Pilih Paket
          </button>
          <a
            href="#layanan"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#F97316] px-4 py-2 text-xs font-bold text-white shadow-[0_4px_14px_rgba(249,115,22,0.35)] transition-all hover:bg-[#EA580C]"
          >
            Lihat Tarif
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className={`flex h-9 w-9 items-center justify-center rounded-lg border md:hidden ${
            scrolled
              ? "border-slate-200 bg-white text-slate-800"
              : "border-white/20 bg-white/10 text-white"
          }`}
          aria-label="Menu navigasi"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-slate-200 bg-white px-4 py-4 md:hidden"
        >
          <div className="flex flex-col gap-3 text-sm font-semibold text-slate-800">
            <a href="#layanan" onClick={() => setMobileOpen(false)} className="py-1">
              Katalog Paket
            </a>
            <a href="#cara-kerja" onClick={() => setMobileOpen(false)} className="py-1">
              Alur Pendampingan
            </a>
            <a href="#prinsip" onClick={() => setMobileOpen(false)} className="py-1">
              Etika Akademik
            </a>
            <a href="#faq" onClick={() => setMobileOpen(false)} className="py-1">
              FAQ
            </a>
            <div className="mt-2 flex flex-col gap-2 border-t border-slate-200 pt-3">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onOpenMatcher();
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-center text-xs font-semibold text-slate-800"
              >
                Bingung Pilih Paket?
              </button>
              <a
                href="#layanan"
                onClick={() => setMobileOpen(false)}
                className="w-full rounded-xl bg-[#F97316] px-4 py-2.5 text-center text-xs font-bold text-white"
              >
                Lihat Paket Layanan
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
