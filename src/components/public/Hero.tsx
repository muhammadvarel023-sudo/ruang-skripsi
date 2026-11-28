"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
import type { CampusType, CategoryDTO } from "@/lib/types";
import { formatRupiah } from "@/lib/format";
import { APPLE_EASE, APPLE_SPRING } from "@/lib/motion";

interface HeroProps {
  categories: CategoryDTO[];
  totalPackages: number;
  campusType: CampusType;
  nonTelkomSurcharge: number;
  onChangeCampusType: (type: CampusType) => void;
  onOpenMatcher: () => void;
  onSelectChapterFromHero: (chapterIndex: number) => void;
}

export function Hero({
  categories,
  totalPackages,
  campusType,
  nonTelkomSurcharge,
  onChangeCampusType,
  onOpenMatcher,
  onSelectChapterFromHero,
}: HeroProps) {
  const [peekIndex, setPeekIndex] = useState(0);
  const currentCat = categories[peekIndex] ?? categories[0];
  const surcharge = campusType === "NON_TELKOM" ? nonTelkomSurcharge : 0;

  const lowestPrice = currentCat?.packages.length
    ? Math.min(
        ...currentCat.packages.map((p) =>
          (p.discountPrice && p.discountPrice < p.price
            ? p.discountPrice
            : p.price) + surcharge
        )
      )
    : 0;

  return (
    <section className="relative overflow-x-clip bg-paper pb-16 pt-10 sm:pb-20 sm:pt-12 lg:pb-24 lg:pt-14">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-10">
          {/* Left punchy editorial column */}
          <motion.div
            initial={false}
            animate={{ y: 0 }}
            transition={{ duration: 0.55, ease: APPLE_EASE }}
            className="lg:col-span-6"
          >
            <h1 className="max-w-[13ch] font-display text-ink">
              Skripsi kualitatif beres lebih terarah.
            </h1>

            <p className="lead mt-5 max-w-[38ch] text-ink-2">
              Mentoring 1-on-1 Ilmu Komunikasi untuk mahasiswa Tel-U FKS dan PTS Bandung.
            </p>

            {/* Primary CTA + quiet action */}
            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <a href="#layanan" className="btn-primary">
                Pilih Paket
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>

              <button
                type="button"
                onClick={onOpenMatcher}
                className="btn-quiet"
              >
                <Compass className="h-4 w-4 text-accent" aria-hidden="true" />
                Cocokkan Kondisi
              </button>
            </div>

            {/* Compact visual stat bento chips */}
            <div className="mt-8 grid max-w-md grid-cols-3 gap-3">
              <div className="tile-green p-4">
                <p className="num font-display text-2xl text-accent">
                  {totalPackages}
                </p>
                <p className="mt-0.5 text-xs font-bold text-ink-2">
                  Paket modular
                </p>
              </div>
              <div className="tile-green p-4">
                <p className="font-display text-2xl text-ink">FKS</p>
                <p className="mt-0.5 text-xs font-bold text-ink-2">
                  Tarif khusus
                </p>
              </div>
              <div className="tile-green p-4">
                <p className="num font-display text-2xl text-accent">1-on-1</p>
                <p className="mt-0.5 text-xs font-bold text-ink-2">
                  Bukan joki
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Arch Photo + Interactive Warm-Cream Estimator Card */}
          <div className="relative lg:col-span-6">
            <div className="grid items-end gap-5 sm:grid-cols-12">
              <div className="sm:col-span-7">
                <div className="surface-card p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-2 border-b border-[var(--color-card-rule)] pb-3">
                    <span className="text-sm font-bold text-card-ink">
                      Simulasi Tarif Cepat
                    </span>
                    <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-accent-ink">
                      {currentCat?.shortLabel ?? "Bab 1"}
                    </span>
                  </div>

                  {/* Quick campus toggle */}
                  <div className="mt-4">
                    <p className="text-xs font-bold text-[var(--color-card-muted)]">
                      Asal kampus
                    </p>
                    <div className="mt-1.5 grid grid-cols-2 gap-1.5 rounded-2xl bg-black/5 p-1">
                      <button
                        type="button"
                        onClick={() => onChangeCampusType("TELKOM_FKS")}
                        className={`relative rounded-xl px-2.5 py-2 text-xs font-bold transition-colors duration-200 cursor-pointer ${
                          campusType === "TELKOM_FKS"
                            ? "text-ink"
                            : "text-[var(--color-card-muted)] hover:text-card-ink"
                        }`}
                      >
                        {campusType === "TELKOM_FKS" && (
                          <motion.span
                            layoutId="heroCampusPill"
                            transition={APPLE_SPRING}
                            className="absolute inset-0 rounded-xl bg-paper"
                          />
                        )}
                        <span className="relative z-10 whitespace-nowrap">
                          Tel-U FKS
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onChangeCampusType("NON_TELKOM")}
                        className={`relative rounded-xl px-2.5 py-2 text-xs font-bold transition-colors duration-200 cursor-pointer ${
                          campusType === "NON_TELKOM"
                            ? "text-accent-ink"
                            : "text-[var(--color-card-muted)] hover:text-card-ink"
                        }`}
                      >
                        {campusType === "NON_TELKOM" && (
                          <motion.span
                            layoutId="heroCampusPill"
                            transition={APPLE_SPRING}
                            className="absolute inset-0 rounded-xl bg-accent"
                          />
                        )}
                        <span className="relative z-10 whitespace-nowrap">
                          PTS Bandung
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Quick chapter selector */}
                  <div className="mt-4">
                    <p className="text-xs font-bold text-[var(--color-card-muted)]">
                      Pilih progres bab
                    </p>
                    <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                      {categories.map((cat, idx) => {
                        const active = idx === peekIndex;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setPeekIndex(idx)}
                            className={`rounded-xl border px-2 py-2 text-xs font-bold transition-colors duration-200 cursor-pointer ${
                              active
                                ? "border-paper bg-paper text-ink"
                                : "border-[var(--color-card-rule)] bg-white/70 text-card-ink hover:border-paper"
                            }`}
                          >
                            {cat.shortLabel}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Live computed starting tariff */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${currentCat?.id}-${campusType}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.22, ease: APPLE_EASE }}
                      className="mt-5 border-t border-[var(--color-card-rule)] pt-4"
                    >
                      <p className="text-xs font-bold text-[var(--color-card-muted)]">
                        Mulai dari
                      </p>
                      <div className="mt-0.5 flex items-baseline justify-between gap-2">
                        <span className="num font-display text-3xl text-card-ink">
                          {formatRupiah(lowestPrice)}
                        </span>
                        <span className="text-xs font-bold text-paper">
                          {currentCat?.packages.length ?? 0} pilihan paket
                        </span>
                      </div>
                      <a
                        href="#layanan"
                        onClick={() => onSelectChapterFromHero(peekIndex)}
                        className="btn-dark-ink mt-4 w-full justify-center text-sm"
                      >
                        Buka {currentCat?.shortLabel ?? "Paket"}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="sm:col-span-5">
                <figure
                  className="photo-frame frame-arch relative aspect-[3/4] min-h-[340px] w-full overflow-hidden bg-paper-3"
                  data-slot="hero"
                  data-alt="Ruang baca perpustakaan dua tingkat dengan meja diskusi kayu"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Statsbiblioteket_l%C3%A6sesalen-2.jpg/1280px-Statsbiblioteket_l%C3%A6sesalen-2.jpg"
                    srcSet="https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Statsbiblioteket_l%C3%A6sesalen-2.jpg/960px-Statsbiblioteket_l%C3%A6sesalen-2.jpg 960w, https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Statsbiblioteket_l%C3%A6sesalen-2.jpg/1280px-Statsbiblioteket_l%C3%A6sesalen-2.jpg 1280w, https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Statsbiblioteket_l%C3%A6sesalen-2.jpg/1920px-Statsbiblioteket_l%C3%A6sesalen-2.jpg 1920w"
                    sizes="(min-width: 60rem) 24vw, 100vw"
                    width={5165}
                    height={3820}
                    alt="Ruang baca perpustakaan dua tingkat dengan meja diskusi kayu"
                    fetchPriority="high"
                    style={{ objectPosition: "50% 42%" }}
                  />
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
