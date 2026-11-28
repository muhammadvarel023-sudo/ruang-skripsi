"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { APPLE_EASE, APPLE_SPRING } from "@/lib/motion";

interface ChapterShowcaseProps {
  onJumpToChapter: (chapterIndex: number) => void;
}

const METHODS = [
  {
    id: "studi-kasus",
    label: "Studi Kasus",
    chapterIndex: 2,
    focus: "Menggali peristiwa komunikasi tertentu secara mendalam di satu kasus nyata.",
    data: "Wawancara informan kunci + dokumen internal + observasi.",
    output: "Batasan kasus jelas, proposisi riset, dan triangulasi sumber.",
    frameClass: "frame-leaf",
    slot: "method-leaf",
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Fountain_pen_writing_%28literacy%29.jpg/1280px-Fountain_pen_writing_%28literacy%29.jpg",
      srcSet:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Fountain_pen_writing_%28literacy%29.jpg/960px-Fountain_pen_writing_%28literacy%29.jpg 960w, https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Fountain_pen_writing_%28literacy%29.jpg/1280px-Fountain_pen_writing_%28literacy%29.jpg 1280w, https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Fountain_pen_writing_%28literacy%29.jpg/1920px-Fountain_pen_writing_%28literacy%29.jpg 1920w",
      width: 4620,
      height: 3388,
      alt: "Pena menulis rancangan kerangka dan catatan penelitian di atas kertas",
      objectPosition: "30% 50%",
    },
  },
  {
    id: "fenomenologi",
    label: "Fenomenologi",
    chapterIndex: 2,
    focus: "Memahami pengalaman sadar dan pemaknaan informan terhadap suatu realitas.",
    data: "Wawancara mendalam terbuka + refleksi pengalaman subjektif.",
    output: "Kriteria informan relevan, bracketing, dan alur reduksi makna.",
    frameClass: "frame-pill",
    slot: "method-pill",
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Interior_of_the_Paperback_Bookshop_May_2023.jpg/1280px-Interior_of_the_Paperback_Bookshop_May_2023.jpg",
      srcSet:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Interior_of_the_Paperback_Bookshop_May_2023.jpg/960px-Interior_of_the_Paperback_Bookshop_May_2023.jpg 960w, https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Interior_of_the_Paperback_Bookshop_May_2023.jpg/1280px-Interior_of_the_Paperback_Bookshop_May_2023.jpg 1280w, https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Interior_of_the_Paperback_Bookshop_May_2023.jpg/1920px-Interior_of_the_Paperback_Bookshop_May_2023.jpg 1920w",
      width: 3024,
      height: 4032,
      alt: "Rak buku dan literatur tersusun hingga langit-langit ruang baca",
      objectPosition: "50% 45%",
    },
  },
  {
    id: "semiotika",
    label: "Semiotika",
    chapterIndex: 2,
    focus: "Membaca tanda, simbol, visual, dan mitos budaya dalam teks media.",
    data: "Potongan adegan film, iklan, poster, atau konten digital terpilih.",
    output: "Unit analisis visual rapi (Barthes, Peirce, atau Saussure).",
    frameClass: "frame-pebble",
    slot: "method-pebble",
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Salle_de_lecture_Bibliotheque_Sainte-Genevieve_n03.jpg/1280px-Salle_de_lecture_Bibliotheque_Sainte-Genevieve_n03.jpg",
      srcSet:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Salle_de_lecture_Bibliotheque_Sainte-Genevieve_n03.jpg/960px-Salle_de_lecture_Bibliotheque_Sainte-Genevieve_n03.jpg 960w, https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Salle_de_lecture_Bibliotheque_Sainte-Genevieve_n03.jpg/1280px-Salle_de_lecture_Bibliotheque_Sainte-Genevieve_n03.jpg 1280w, https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Salle_de_lecture_Bibliotheque_Sainte-Genevieve_n03.jpg/1920px-Salle_de_lecture_Bibliotheque_Sainte-Genevieve_n03.jpg 1920w",
      width: 4288,
      height: 2848,
      alt: "Meja riset panjang dengan lampu baca di ruang studi",
      objectPosition: "50% 50%",
    },
  },
  {
    id: "wacana",
    label: "Analisis Wacana",
    chapterIndex: 2,
    focus: "Membongkar ideologi, relasi kuasa, atau pembingkaian berita di media.",
    data: "Artikel berita, naskah pidato, atau utas media sosial berpola.",
    output: "Matriks teks-kognisi-sosial (Van Dijk / Fairclough / Entman).",
    frameClass: "frame-leaf",
    slot: "method-wacana",
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Fountain_pen_writing_%28literacy%29.jpg/1280px-Fountain_pen_writing_%28literacy%29.jpg",
      srcSet:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Fountain_pen_writing_%28literacy%29.jpg/960px-Fountain_pen_writing_%28literacy%29.jpg 960w, https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Fountain_pen_writing_%28literacy%29.jpg/1280px-Fountain_pen_writing_%28literacy%29.jpg 1280w, https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Fountain_pen_writing_%28literacy%29.jpg/1920px-Fountain_pen_writing_%28literacy%29.jpg 1920w",
      width: 4620,
      height: 3388,
      alt: "Pena menulis rancangan kerangka dan catatan penelitian di atas kertas",
      objectPosition: "30% 50%",
    },
  },
  {
    id: "netnografi",
    label: "Netnografi",
    chapterIndex: 2,
    focus: "Meneliti interaksi budaya dan perilaku komunitas di ruang digital.",
    data: "Arsip percakapan daring, observasi partisipan, dan wawancara.",
    output: "Peta komunitas digital, etika observasi, dan temuan kultural.",
    frameClass: "frame-pill",
    slot: "method-netno",
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Interior_of_the_Paperback_Bookshop_May_2023.jpg/1280px-Interior_of_the_Paperback_Bookshop_May_2023.jpg",
      srcSet:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Interior_of_the_Paperback_Bookshop_May_2023.jpg/960px-Interior_of_the_Paperback_Bookshop_May_2023.jpg 960w, https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Interior_of_the_Paperback_Bookshop_May_2023.jpg/1280px-Interior_of_the_Paperback_Bookshop_May_2023.jpg 1280w, https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Interior_of_the_Paperback_Bookshop_May_2023.jpg/1920px-Interior_of_the_Paperback_Bookshop_May_2023.jpg 1920w",
      width: 3024,
      height: 4032,
      alt: "Rak buku dan literatur tersusun hingga langit-langit ruang baca",
      objectPosition: "50% 45%",
    },
  },
  {
    id: "deskriptif",
    label: "Deskriptif Kualitatif",
    chapterIndex: 2,
    focus: "Memetakan strategi komunikasi, kampanye PR, atau implementasi program.",
    data: "Wawancara tim pelaksana + dokumentasi kampanye.",
    output: "Kategorisasi tema yang rapi dan selaras dengan rumusan masalah.",
    frameClass: "frame-pebble",
    slot: "method-deskriptif",
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Salle_de_lecture_Bibliotheque_Sainte-Genevieve_n03.jpg/1280px-Salle_de_lecture_Bibliotheque_Sainte-Genevieve_n03.jpg",
      srcSet:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Salle_de_lecture_Bibliotheque_Sainte-Genevieve_n03.jpg/960px-Salle_de_lecture_Bibliotheque_Sainte-Genevieve_n03.jpg 960w, https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Salle_de_lecture_Bibliotheque_Sainte-Genevieve_n03.jpg/1280px-Salle_de_lecture_Bibliotheque_Sainte-Genevieve_n03.jpg 1280w, https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Salle_de_lecture_Bibliotheque_Sainte-Genevieve_n03.jpg/1920px-Salle_de_lecture_Bibliotheque_Sainte-Genevieve_n03.jpg 1920w",
      width: 4288,
      height: 2848,
      alt: "Meja riset panjang dengan lampu baca di ruang studi",
      objectPosition: "50% 50%",
    },
  },
];

export function ChapterShowcase({ onJumpToChapter }: ChapterShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = METHODS[activeIndex];

  return (
    <section
      id="eksplorasi"
      className="scroll-mt-20 border-t border-rule bg-paper-3 py-16 sm:py-24"
    >
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left compact interactive method matrix */}
          <div className="lg:col-span-7">
            <h2 className="font-display text-ink">
              Enam pendekatan yang kami kuasai.
            </h2>
            <p className="mt-2 max-w-[38ch] text-base text-ink-2">
              Pilih tradisi risetmu untuk melihat ringkasan data dan outputnya.
            </p>

            {/* 6 interactive bento pill tabs */}
            <div
              role="tablist"
              aria-label="Pilihan pendekatan kualitatif"
              className="mt-7 flex flex-wrap gap-2"
            >
              {METHODS.map((item, idx) => {
                const active = idx === activeIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveIndex(idx)}
                    className={`relative rounded-2xl px-4 py-2.5 text-sm font-bold transition-colors duration-200 cursor-pointer ${
                      active
                        ? "text-accent-ink"
                        : "bg-paper-2 text-ink hover:bg-paper"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="methodPill"
                        transition={APPLE_SPRING}
                        className="absolute inset-0 rounded-2xl bg-accent"
                      />
                    )}
                    <span className="relative z-10 whitespace-nowrap">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 3-Box Compact Matrix (short scannable cards) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: APPLE_EASE }}
                className="mt-6 grid gap-3 sm:grid-cols-3"
              >
                <div className="tile-green p-4">
                  <p className="text-xs font-bold text-accent">Fokus Utama</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink">
                    {current.focus}
                  </p>
                </div>
                <div className="tile-green p-4">
                  <p className="text-xs font-bold text-accent">Sumber Data</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink">
                    {current.data}
                  </p>
                </div>
                <div className="tile-green p-4">
                  <p className="text-xs font-bold text-accent">Output Sesi</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink">
                    {current.output}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6">
              <a
                href="#layanan"
                onClick={() => onJumpToChapter(current.chapterIndex)}
                className="btn-primary text-sm"
              >
                Pilih Paket Metodologi
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Right Morphing Organic Photo Silhouettes */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -6 }}
                transition={{ duration: 0.4, ease: APPLE_EASE }}
                className="mx-auto max-w-[440px]"
              >
                <figure
                  className={`photo-frame ${current.frameClass} aspect-[4/4] min-h-[340px] w-full overflow-hidden bg-paper-2`}
                  data-slot={current.slot}
                  data-alt={current.photo.alt}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={current.photo.src}
                    srcSet={current.photo.srcSet}
                    sizes="(min-width: 60rem) 35vw, 100vw"
                    width={current.photo.width}
                    height={current.photo.height}
                    alt={current.photo.alt}
                    loading="lazy"
                    style={{ objectPosition: current.photo.objectPosition }}
                  />
                </figure>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
