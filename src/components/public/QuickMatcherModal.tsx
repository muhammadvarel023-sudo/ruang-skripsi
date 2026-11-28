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
    title: "Masih bingung topik atau judul dan butuh pegangan ACC dosen",
    desc: "Dapat brainstorming, 2 opsi judul kualitatif, rumusan masalah, + Mini Outline 1 halaman.",
    targetSlug: "bab-1-pondasi-judul-rumusan",
  },
  {
    id: "bab1-full",
    title: "Ingin menyusun Bab 1 secara utuh dan runtut sampai siap bimbingan",
    desc: "Butuh pendampingan alur latar belakang, arah data, fokus, sampai manfaat + review draft.",
    targetSlug: "bab-1-pendahuluan-terstruktur",
  },
  {
    id: "bab2-review",
    title: "Sudah punya teori dan kerangka, butuh review",
    desc: "Ingin mengecek relevansi teori, penelitian terdahulu, dan keterhubungan konsep.",
    targetSlug: "bab-2-basic-research-framework",
  },
  {
    id: "bab2-develop",
    title: "Sudah punya grand theory, belum ada research gap dan kerangka",
    desc: "Butuh pemetaan penelitian terdahulu dan penyusunan kerangka pemikiran.",
    targetSlug: "bab-2-theory-development",
  },
  {
    id: "bab2-from-zero",
    title: "Belum punya teori, referensi, maupun kerangka Bab 2",
    desc: "Butuh pendampingan bertahap dari pemetaan konsep hingga kurasi literatur.",
    targetSlug: "bab-2-comprehensive-literature-research",
  },
  {
    id: "bab3-review",
    title: "Sudah punya rancangan metodologi, ingin diaudit",
    desc: "Ingin memastikan metode dan teknik analisis cocok dengan rumusan masalah.",
    targetSlug: "bab-3-methodology-review",
  },
  {
    id: "bab3-develop",
    title: "Masih bingung menentukan metode dan analisis data",
    desc: "Butuh bantuan merancang desain penelitian kualitatif dari awal.",
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
            className="fixed inset-0 bg-ink/50"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="matcher-title"
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.34, ease: APPLE_EASE }}
            className="well-solstice relative z-10 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden"
          >
            <div className="flex items-start justify-between border-b border-rule bg-paper px-6 py-5">
              <div className="flex items-center gap-3">
                <Compass className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <h3 id="matcher-title" className="font-display text-xl text-ink">
                    Bantu Pilih Paket yang Tepat
                  </h3>
                  <p className="mt-0.5 text-sm text-ink-2">
                    Pilih satu kondisi yang paling menggambarkan progres skripsimu saat ini.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-2 transition-colors duration-200 hover:bg-paper-3 hover:text-ink active:translate-y-px cursor-pointer"
                aria-label="Tutup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto bg-paper-2 p-5 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {DIAGNOSTIC_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handlePick(opt.targetSlug)}
                    className="group flex flex-col justify-between border border-rule bg-paper p-4 text-left transition-colors duration-200 hover:border-ink active:translate-y-px cursor-pointer"
                  >
                    <div>
                      <p className="font-display text-base leading-snug text-ink transition-colors duration-200 group-hover:text-accent">
                        {opt.title}
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-ink-2">
                        {opt.desc}
                      </p>
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
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
