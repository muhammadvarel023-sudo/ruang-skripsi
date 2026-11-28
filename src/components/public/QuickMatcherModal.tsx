"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Compass } from "lucide-react";
import type { CategoryDTO } from "@/lib/types";
import { APPLE_EASE } from "@/lib/motion";

interface QuickMatcherModalProps {
  open: boolean;
  categories: CategoryDTO[];
  onClose: () => void;
  onRecommend: (categoryId: string, packageId: string) => void;
}

const DIAGNOSTIC_OPTIONS = [
  {
    id: "idea-title",
    title: "Belum punya judul dan butuh pegangan ACC",
    desc: "2 opsi judul kualitatif + rumusan masalah + mini outline.",
    targetSlug: "bab-1-pondasi-judul-rumusan",
  },
  {
    id: "bab1-full",
    title: "Menyusun Bab 1 utuh sampai siap bimbingan",
    desc: "Alur latar belakang, fokus riset, dan review draft.",
    targetSlug: "bab-1-pendahuluan-terstruktur",
  },
  {
    id: "bab2-review",
    title: "Sudah punya teori, butuh review Bab 2",
    desc: "Cek relevansi teori, riset terdahulu, dan alur konsep.",
    targetSlug: "bab-2-basic-research-framework",
  },
  {
    id: "bab2-develop",
    title: "Sudah ada grand theory, belum ada research gap",
    desc: "Matriks penelitian terdahulu dan bagan kerangka pemikiran.",
    targetSlug: "bab-2-theory-development",
  },
  {
    id: "bab2-from-zero",
    title: "Belum punya teori maupun kerangka Bab 2",
    desc: "Pemetaan konsep bertahap hingga kurasi literatur.",
    targetSlug: "bab-2-comprehensive-literature-research",
  },
  {
    id: "bab3-review",
    title: "Sudah ada draft metodologi, ingin diaudit",
    desc: "Sinkronisasi metode analisis dengan rumusan masalah.",
    targetSlug: "bab-3-methodology-review",
  },
  {
    id: "bab3-develop",
    title: "Bingung menentukan metode kualitatif Bab 3",
    desc: "Merancang desain studi, informan, dan triangulasi.",
    targetSlug: "bab-3-methodology-development",
  },
];

export function QuickMatcherModal({
  open,
  categories,
  onClose,
  onRecommend,
}: QuickMatcherModalProps) {
  const handlePick = (targetSlug: string) => {
    for (const cat of categories) {
      const found = cat.packages.find((p) => p.slug === targetSlug);
      if (found) {
        onRecommend(cat.id, found.id);
        return;
      }
    }
    if (categories[0]?.packages[0]) {
      onRecommend(categories[0].id, categories[0].packages[0].id);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: APPLE_EASE }}
            onClick={onClose}
            className="fixed inset-0 bg-black/55"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="matcher-title"
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.32, ease: APPLE_EASE }}
            className="surface-card relative z-10 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden"
          >
            <div className="flex items-start justify-between bg-paper-3 px-6 py-5 text-ink">
              <div className="flex items-center gap-3">
                <Compass className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <h3 id="matcher-title" className="font-display text-xl text-ink">
                    Cocokkan Kondisi Skripsimu
                  </h3>
                  <p className="mt-0.5 text-xs text-ink-2">
                    Pilih satu kartu yang paling pas dengan kondisimu saat ini.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-paper-2 text-ink transition-colors duration-200 hover:bg-accent hover:text-accent-ink active:translate-y-px cursor-pointer"
                aria-label="Tutup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-5 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {DIAGNOSTIC_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handlePick(opt.targetSlug)}
                    className="group flex flex-col justify-between rounded-2xl border-2 border-[var(--color-card-rule)] bg-white/80 p-4 text-left transition-colors duration-200 hover:border-paper active:translate-y-px cursor-pointer"
                  >
                    <div>
                      <p className="font-display text-base leading-snug text-card-ink transition-colors duration-200 group-hover:text-paper">
                        {opt.title}
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-card-muted)]">
                        {opt.desc}
                      </p>
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-paper">
                      Lihat rekomendasi
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
