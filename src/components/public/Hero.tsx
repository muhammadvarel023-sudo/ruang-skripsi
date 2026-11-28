"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Compass, Layers } from "lucide-react";
import { APPLE_EASE, APPLE_SPRING } from "@/lib/motion";

interface HeroProps {
  totalPackages: number;
  onOpenMatcher: () => void;
  onSelectChapterFromHero: (chapterIndex: number) => void;
}

const CHAPTER_PEEKS = [
  {
    id: "bab1",
    label: "Bab 1",
    title: "Pendahuluan & Judul",
    summary: "Fenomena komunikasi, dua opsi judul kualitatif, dan struktur latar belakang.",
    packagesLabel: "2 paket tersedia",
  },
  {
    id: "bab2",
    label: "Bab 2",
    title: "Tinjauan Pustaka",
    summary: "Teori komunikasi, matriks penelitian terdahulu, research gap, dan kerangka.",
    packagesLabel: "3 paket tersedia",
  },
  {
    id: "bab3",
    label: "Bab 3",
    title: "Metodologi Kualitatif",
    summary: "Studi kasus, fenomenologi, semiotika, analisis wacana, dan triangulasi.",
    packagesLabel: "2 paket tersedia",
  },
];

export function Hero({
  totalPackages,
  onOpenMatcher,
  onSelectChapterFromHero,
}: HeroProps) {
  const [peekIndex, setPeekIndex] = useState(0);
  const currentPeek = CHAPTER_PEEKS[peekIndex];

  return (
    <section className="relative overflow-x-clip bg-paper pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left editorial column */}
          <motion.div
            initial={false}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: APPLE_EASE }}
            className="lg:col-span-6"
          >
            <h1 className="max-w-[16ch] font-display text-ink">
              Pendampingan skripsi komunikasi kualitatif.
            </h1>

            <p className="lead mt-6 max-w-[46ch] text-ink-2">
              Mentoring 1-on-1 skripsi Ilmu Komunikasi untuk Telkom University FKS dan PTS Bandung.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <a href="#layanan" className="btn-primary">
                Pilih Paket &amp; Tarif
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>

              <button
                type="button"
                onClick={onOpenMatcher}
                className="btn-underline"
              >
                <Compass className="h-4 w-4 text-accent" aria-hidden="true" />
                Bingung Pilih Paket?
              </button>
            </div>

            {/* Hairline-parted key facts */}
            <div className="mt-10 grid grid-cols-3 border-t border-rule pt-6 sm:max-w-lg">
              <div className="pr-4">
                <p className="num font-display text-2xl text-ink">
                  {totalPackages} Paket
                </p>
                <p className="mt-1 text-sm text-ink-2">Rumpun Kualitatif</p>
              </div>
              <div className="border-l border-rule px-4">
                <p className="font-display text-2xl text-accent">FKS Tel-U</p>
                <p className="mt-1 text-sm text-ink-2">Tarif Spesial Kampus</p>
              </div>
              <div className="border-l border-rule pl-4">
                <p className="num font-display text-2xl text-ink">1-on-1</p>
                <p className="mt-1 text-sm text-ink-2">Mentoring Aktif</p>
              </div>
            </div>
          </motion.div>

          {/* Right Arch-Framed Photography + Interactive Chapter Peek */}
          <div className="relative lg:col-span-6">
            <div className="relative mx-auto max-w-[540px] lg:ml-auto lg:mr-0">
              <figure
                className="photo-frame frame-arch relative aspect-[4/5] min-h-[440px] w-full overflow-hidden bg-paper-3"
                data-slot="hero"
                data-alt="Ruang baca perpustakaan dua tingkat dengan meja diskusi kayu"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Statsbiblioteket_l%C3%A6sesalen-2.jpg/1280px-Statsbiblioteket_l%C3%A6sesalen-2.jpg"
                  srcSet="https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Statsbiblioteket_l%C3%A6sesalen-2.jpg/960px-Statsbiblioteket_l%C3%A6sesalen-2.jpg 960w, https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Statsbiblioteket_l%C3%A6sesalen-2.jpg/1280px-Statsbiblioteket_l%C3%A6sesalen-2.jpg 1280w, https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Statsbiblioteket_l%C3%A6sesalen-2.jpg/1920px-Statsbiblioteket_l%C3%A6sesalen-2.jpg 1920w"
                  sizes="(min-width: 60rem) 45vw, 100vw"
                  width={5165}
                  height={3820}
                  alt="Ruang baca perpustakaan dua tingkat dengan meja diskusi kayu"
                  fetchPriority="high"
                  style={{ objectPosition: "50% 42%" }}
                />
              </figure>

              {/* Floating interactive chapter selector plate */}
              <div className="well-solstice relative z-20 -mt-16 mx-4 p-5 sm:mx-6 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <Layers className="h-4 w-4 text-accent" aria-hidden="true" />
                    <span>Cakupan per Bab</span>
                  </div>

                  <div
                    role="tablist"
                    aria-label="Pratinjau bab pendampingan"
                    className="flex items-center gap-1 rounded-full bg-paper p-1"
                  >
                    {CHAPTER_PEEKS.map((item, idx) => {
                      const active = idx === peekIndex;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          onClick={() => setPeekIndex(idx)}
                          className={`relative rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                            active
                              ? "text-accent-ink"
                              : "text-ink-2 hover:text-ink"
                          }`}
                        >
                          {active && (
                            <motion.span
                              layoutId="heroChapterPill"
                              transition={APPLE_SPRING}
                              className="absolute inset-0 rounded-full bg-ink"
                            />
                          )}
                          <span className="relative z-10 whitespace-nowrap">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPeek.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.24, ease: APPLE_EASE }}
                    className="pt-3.5"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="font-display text-lg text-ink">
                        {currentPeek.title}
                      </p>
                      <span className="small-print text-accent">
                        {currentPeek.packagesLabel}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
                      {currentPeek.summary}
                    </p>
                    <div className="mt-3 flex items-center justify-between border-t border-rule pt-3">
                      <span className="text-xs text-muted">
                        Fokus Ilmu Komunikasi &amp; Riset Kualitatif
                      </span>
                      <a
                        href="#layanan"
                        onClick={() => onSelectChapterFromHero(peekIndex)}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors duration-200 hover:text-ink"
                      >
                        Buka paket
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
