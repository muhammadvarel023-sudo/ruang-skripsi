"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { APPLE_EASE, APPLE_SPRING } from "@/lib/motion";

interface ChapterShowcaseProps {
  onJumpToChapter: (chapterIndex: number) => void;
}

const EXPLORATION_STAGES = [
  {
    id: "bab-1",
    chapterIndex: 0,
    tabLabel: "Bab 1: Arah & Judul",
    headline: "Tajamkan fenomena sebelum mengajukan judul.",
    lead: "Banyak mahasiswa ditolak bukan karena topiknya salah, melainkan rumusan fokus dan urgensi komunikasi yang masih kabur.",
    frameClass: "frame-leaf",
    aspectClass: "aspect-[4/3]",
    slot: "explore-bab1",
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Fountain_pen_writing_%28literacy%29.jpg/1280px-Fountain_pen_writing_%28literacy%29.jpg",
      srcSet:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Fountain_pen_writing_%28literacy%29.jpg/960px-Fountain_pen_writing_%28literacy%29.jpg 960w, https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Fountain_pen_writing_%28literacy%29.jpg/1280px-Fountain_pen_writing_%28literacy%29.jpg 1280w, https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Fountain_pen_writing_%28literacy%29.jpg/1920px-Fountain_pen_writing_%28literacy%29.jpg 1920w",
      width: 4620,
      height: 3388,
      alt: "Pena menulis rancangan kerangka dan catatan penelitian di atas kertas",
      objectPosition: "30% 50%",
      caption: "Pemetaan fenomena komunikasi dan perumusan dua opsi judul.",
    },
    deliverables: [
      "Dua opsi judul kualitatif yang spesifik objek dan fokusnya",
      "Mini outline 1 halaman untuk pegangan konsultasi dosen",
      "Penyelarasan latar belakang, pertanyaan riset, dan manfaat",
    ],
  },
  {
    id: "bab-2",
    chapterIndex: 1,
    tabLabel: "Bab 2: Teori & Gap",
    headline: "Sambungkan teori dengan celah penelitian.",
    lead: "Bab 2 bukan sekadar tempelan definisi buku, melainkan argumen kenapa studimu mengisi celah dari riset sebelumnya.",
    frameClass: "frame-pill",
    aspectClass: "aspect-[3/4]",
    slot: "explore-bab2",
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Interior_of_the_Paperback_Bookshop_May_2023.jpg/1280px-Interior_of_the_Paperback_Bookshop_May_2023.jpg",
      srcSet:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Interior_of_the_Paperback_Bookshop_May_2023.jpg/960px-Interior_of_the_Paperback_Bookshop_May_2023.jpg 960w, https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Interior_of_the_Paperback_Bookshop_May_2023.jpg/1280px-Interior_of_the_Paperback_Bookshop_May_2023.jpg 1280w, https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Interior_of_the_Paperback_Bookshop_May_2023.jpg/1920px-Interior_of_the_Paperback_Bookshop_May_2023.jpg 1920w",
      width: 3024,
      height: 4032,
      alt: "Rak buku dan literatur tersusun hingga langit-langit ruang baca",
      objectPosition: "50% 45%",
      caption: "Kurasi literatur komunikasi dan matriks penelitian terdahulu.",
    },
    deliverables: [
      "Audit relevansi grand theory terhadap fenomena lapangan",
      "Penyusunan matriks penelitian terdahulu dan research gap",
      "Bagan alur kerangka pemikiran yang logis saat diuji",
    ],
  },
  {
    id: "bab-3",
    chapterIndex: 2,
    tabLabel: "Bab 3: Metodologi",
    headline: "Desain riset kualitatif yang konsisten.",
    lead: "Dari paradigma konstruktivis hingga teknik triangulasi, setiap bagian Bab 3 dirancang agar siap menghadapi pertanyaan penguji.",
    frameClass: "frame-pebble",
    aspectClass: "aspect-[4/3]",
    slot: "explore-bab3",
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Salle_de_lecture_Bibliotheque_Sainte-Genevieve_n03.jpg/1280px-Salle_de_lecture_Bibliotheque_Sainte-Genevieve_n03.jpg",
      srcSet:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Salle_de_lecture_Bibliotheque_Sainte-Genevieve_n03.jpg/960px-Salle_de_lecture_Bibliotheque_Sainte-Genevieve_n03.jpg 960w, https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Salle_de_lecture_Bibliotheque_Sainte-Genevieve_n03.jpg/1280px-Salle_de_lecture_Bibliotheque_Sainte-Genevieve_n03.jpg 1280w, https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Salle_de_lecture_Bibliotheque_Sainte-Genevieve_n03.jpg/1920px-Salle_de_lecture_Bibliotheque_Sainte-Genevieve_n03.jpg 1920w",
      width: 4288,
      height: 2848,
      alt: "Meja riset panjang dengan lampu baca di ruang studi",
      objectPosition: "50% 50%",
      caption: "Kesesuaian metode studi kasus, fenomenologi, semiotika, dan analisis wacana.",
    },
    deliverables: [
      "Pemilihan paradigma dan tradisi kualitatif yang akurat",
      "Kriteria informan, unit analisis, serta kisi wawancara",
      "Teknik keabsahan data dan strategi analisis tematik",
    ],
  },
];

export function ChapterShowcase({ onJumpToChapter }: ChapterShowcaseProps) {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const current = EXPLORATION_STAGES[activeStageIndex];

  return (
    <section
      id="eksplorasi"
      className="scroll-mt-20 border-t border-rule bg-paper py-20 sm:py-28"
    >
      <div className="container">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left interactive controls & deliverables */}
          <div className="lg:col-span-6">
            <h2 className="font-display text-ink">
              Materi pendampingan sesuai titik skripsimu.
            </h2>
            <p className="lead mt-4 text-ink-2">
              Klik tiap tahap di bawah untuk melihat fokus diskusi dan bentuk output yang
              kita bedah selama sesi berlangsung.
            </p>

            {/* Smooth Apple-style segmented switcher */}
            <div
              role="tablist"
              aria-label="Eksplorasi tahap skripsi"
              className="mt-8 flex flex-wrap gap-2 border-b border-rule pb-6"
            >
              {EXPLORATION_STAGES.map((stage, idx) => {
                const active = idx === activeStageIndex;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveStageIndex(idx)}
                    className={`relative rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                      active
                        ? "border-ink text-paper"
                        : "border-rule bg-paper-2 text-ink hover:border-ink/50"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="exploreStagePill"
                        transition={APPLE_SPRING}
                        className="absolute inset-0 rounded-full bg-ink"
                      />
                    )}
                    <span className="relative z-10 whitespace-nowrap">
                      {stage.tabLabel}
                    </span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.32, ease: APPLE_EASE }}
                className="pt-6"
              >
                <h3 className="font-display text-2xl text-ink sm:text-3xl">
                  {current.headline}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-ink-2">
                  {current.lead}
                </p>

                <ul className="mt-6 space-y-3 border-t border-rule pt-5">
                  {current.deliverables.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm leading-relaxed text-ink"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7">
                  <button
                    type="button"
                    onClick={() => onJumpToChapter(current.chapterIndex)}
                    className="btn-underline"
                  >
                    Lihat paket {current.tabLabel.split(":")[0]}
                    <ArrowRight className="h-4 w-4 text-accent" aria-hidden="true" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right morphing non-boxy photo silhouette */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 0.97, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -6 }}
                transition={{ duration: 0.44, ease: APPLE_EASE }}
                className="mx-auto max-w-[520px]"
              >
                <figure
                  className={`photo-frame ${current.frameClass} ${current.aspectClass} min-h-[380px] w-full overflow-hidden bg-paper-3`}
                  data-slot={current.slot}
                  data-alt={current.photo.alt}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={current.photo.src}
                    srcSet={current.photo.srcSet}
                    sizes="(min-width: 60rem) 42vw, 100vw"
                    width={current.photo.width}
                    height={current.photo.height}
                    alt={current.photo.alt}
                    loading="lazy"
                    style={{ objectPosition: current.photo.objectPosition }}
                  />
                </figure>
                <p className="small-print mt-4 text-ink-2">
                  {current.photo.caption}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
