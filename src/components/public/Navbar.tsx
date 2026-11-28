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
          ? "border-rule bg-paper-3/95 backdrop-blur-md"
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
          <span className="font-display text-xl text-ink">{brandName}</span>
        </Link>

        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-6 text-sm font-bold text-ink-2 lg:flex"
        >
          <a
            href="#peta-riset"
            className="whitespace-nowrap py-2 transition-colors duration-200 hover:text-accent"
          >
            Bagan Riset
          </a>
          <a
            href="#layanan"
            className="whitespace-nowrap py-2 transition-colors duration-200 hover:text-accent"
          >
            Paket
          </a>
          <a
            href="#eksplorasi"
            className="whitespace-nowrap py-2 transition-colors duration-200 hover:text-accent"
          >
            Metode
          </a>
          <a
            href="#cara-kerja"
            className="whitespace-nowrap py-2 transition-colors duration-200 hover:text-accent"
          >
            Alur
          </a>
          <a
            href="#prinsip"
            className="whitespace-nowrap py-2 transition-colors duration-200 hover:text-accent"
          >
            Etika
          </a>
          <a
            href="#faq"
            className="whitespace-nowrap py-2 transition-colors duration-200 hover:text-accent"
          >
            FAQ
          </a>
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          <button
            type="button"
            onClick={onOpenMatcher}
            className="btn-quiet min-h-[44px] px-4 text-sm"
          >
            Cocokkan Paket
          </button>
          <a href="#layanan" className="btn-primary min-h-[44px] px-5 text-sm">
            Pilih Paket
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-rule bg-paper-2 text-ink transition-colors duration-200 hover:border-accent active:translate-y-px lg:hidden cursor-pointer"
          aria-label="Menu navigasi"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Apple-smooth scroll progress line */}
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
          className="border-t border-rule bg-paper-3 px-4 py-5 lg:hidden"
        >
          <div className="grid grid-cols-2 gap-2 text-sm font-bold text-ink">
            <a
              href="#peta-riset"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl bg-paper-2 px-3 py-2.5 transition-colors duration-200 hover:bg-paper"
            >
              Bagan Riset
            </a>
            <a
              href="#layanan"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl bg-paper-2 px-3 py-2.5 transition-colors duration-200 hover:bg-paper"
            >
              Paket &amp; Tarif
            </a>
            <a
              href="#eksplorasi"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl bg-paper-2 px-3 py-2.5 transition-colors duration-200 hover:bg-paper"
            >
              Metode Kualitatif
            </a>
            <a
              href="#cara-kerja"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl bg-paper-2 px-3 py-2.5 transition-colors duration-200 hover:bg-paper"
            >
              Alur Sesi
            </a>
            <a
              href="#prinsip"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl bg-paper-2 px-3 py-2.5 transition-colors duration-200 hover:bg-paper"
            >
              Etika Akademik
            </a>
            <a
              href="#faq"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl bg-paper-2 px-3 py-2.5 transition-colors duration-200 hover:bg-paper"
            >
              FAQ
            </a>
          </div>
          <div className="mt-3 flex flex-col gap-2 border-t border-rule pt-3">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenMatcher();
              }}
              className="btn-quiet w-full justify-center"
            >
              Cocokkan Paket
            </button>
            <a
              href="#layanan"
              onClick={() => setMobileOpen(false)}
              className="btn-primary w-full justify-center"
            >
              Pilih Paket Layanan
            </a>
          </div>
        </motion.div>
      )}
    </header>
  );
}
