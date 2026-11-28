"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { APPLE_EASE, APPLE_TRANSITION } from "@/lib/motion";

interface NavbarProps {
  brandName: string;
  onOpenMatcher: () => void;
}

export function Navbar({ brandName, onOpenMatcher }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-[300] border-b transition-colors duration-200 ${
        scrolled
          ? "border-rule bg-paper-2/95 backdrop-blur-md"
          : "border-rule/70 bg-paper"
      }`}
    >
      <div className="container flex h-18 items-center justify-between gap-4">
        <Link
          href="/"
          aria-label={`${brandName} beranda`}
          className="group flex items-center gap-3 whitespace-nowrap"
        >
          <BrandLogo
            size={36}
            className="transition-transform duration-200 group-hover:scale-105"
          />
          <span className="font-display text-lg text-ink">{brandName}</span>
        </Link>

        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-7 text-sm font-medium text-ink-2 md:flex"
        >
          <a
            href="#layanan"
            className="whitespace-nowrap py-2 transition-colors duration-200 hover:text-accent"
          >
            Katalog Paket
          </a>
          <a
            href="#eksplorasi"
            className="whitespace-nowrap py-2 transition-colors duration-200 hover:text-accent"
          >
            Jelajah Bab
          </a>
          <a
            href="#cara-kerja"
            className="whitespace-nowrap py-2 transition-colors duration-200 hover:text-accent"
          >
            Alur Sesi
          </a>
          <a
            href="#prinsip"
            className="whitespace-nowrap py-2 transition-colors duration-200 hover:text-accent"
          >
            Etika Akademik
          </a>
          <a
            href="#faq"
            className="whitespace-nowrap py-2 transition-colors duration-200 hover:text-accent"
          >
            Pertanyaan
          </a>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <button
            type="button"
            onClick={onOpenMatcher}
            className="btn-underline whitespace-nowrap"
          >
            Bantu Pilih Paket
          </button>
          <a href="#layanan" className="btn-quiet min-h-[44px] px-5 text-sm">
            Lihat Tarif
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-rule bg-paper-2 text-ink transition-colors duration-200 hover:border-ink active:translate-y-px md:hidden cursor-pointer"
          aria-label="Menu navigasi"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Apple-smooth hairline scroll progress */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX }}
        className="h-[2px] w-full origin-left bg-accent"
      />

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...APPLE_TRANSITION, duration: 0.24, ease: APPLE_EASE }}
          className="border-t border-rule bg-paper-2 px-4 py-5 md:hidden"
        >
          <div className="flex flex-col gap-2 text-base font-medium text-ink">
            <a
              href="#layanan"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-2 py-2.5 transition-colors duration-200 hover:bg-paper"
            >
              Katalog Paket
            </a>
            <a
              href="#eksplorasi"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-2 py-2.5 transition-colors duration-200 hover:bg-paper"
            >
              Jelajah Bab
            </a>
            <a
              href="#cara-kerja"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-2 py-2.5 transition-colors duration-200 hover:bg-paper"
            >
              Alur Sesi
            </a>
            <a
              href="#prinsip"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-2 py-2.5 transition-colors duration-200 hover:bg-paper"
            >
              Etika Akademik
            </a>
            <a
              href="#faq"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-2 py-2.5 transition-colors duration-200 hover:bg-paper"
            >
              Pertanyaan
            </a>
            <div className="mt-2 flex flex-col gap-2.5 border-t border-rule pt-4">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onOpenMatcher();
                }}
                className="btn-quiet w-full justify-center"
              >
                Bingung Pilih Paket?
              </button>
              <a
                href="#layanan"
                onClick={() => setMobileOpen(false)}
                className="btn-primary w-full justify-center"
              >
                Lihat Paket Layanan
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
