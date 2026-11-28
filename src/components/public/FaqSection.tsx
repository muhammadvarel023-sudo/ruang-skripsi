"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import { APPLE_EASE } from "@/lib/motion";

export function FaqSection({
  nonTelkomSurcharge,
}: {
  nonTelkomSurcharge: number;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Bidang apa saja yang didampingi?",
      a: "Khusus Ilmu Komunikasi (PR, Marcomm, Media, Broadcasting, Komunikasi Digital) dengan metode Kualitatif (studi kasus, fenomenologi, semiotika, analisis wacana, netnografi).",
    },
    {
      q: "Kenapa tarif kampus berbeda?",
      a: `Tarif dasar khusus mahasiswa FKS Telkom University (+ bonus 1x follow-up). PTS Bandung lainnya (UNISBA, UNPAS, UNIKOM, UNPAR, dsb.) dikenakan penyesuaian +${formatRupiah(
        nonTelkomSurcharge
      )} per paket.`,
    },
    {
      q: "Apakah ini jasa joki skripsi?",
      a: "Tidak. TelisikRiset adalah mentoring 1-on-1 untuk brainstorming, pemetaan teori, dan evaluasi metodologi agar kamu menguasai risetmu sendiri.",
    },
    {
      q: "Apakah harus pesan semua bab?",
      a: "Tidak perlu. Sistem modular memungkinkan kamu memilih Bab 1, Bab 2, atau Bab 3 saja sesuai progresmu.",
    },
    {
      q: "Bagaimana aturan reschedule & refund?",
      a: "Reschedule gratis 1x minimal H-1. Jika pakai skema DP 50% dan kurang cocok setelah sesi 1, kamu bebas tidak melanjutkan sesi berikutnya tanpa melunasi sisa.",
    },
    {
      q: "Kapan saya melakukan pembayaran?",
      a: "Setelah mengisi formulir pemesanan, kamu langsung mendapat kode pesanan serta pilihan QRIS atau transfer bank untuk konfirmasi via Telegram atau LINE.",
    },
  ];

  return (
    <section
      id="faq"
      className="scroll-mt-20 border-t border-rule bg-paper py-16 sm:py-24"
    >
      <div className="container">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-ink">Pertanyaan umum.</h2>
            <p className="mt-2 max-w-[36ch] text-base text-ink-2">
              Klik kotak pertanyaan di bawah untuk melihat jawaban ringkasnya.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.q}
                className={`rounded-[24px] p-5 transition-colors duration-200 ${
                  isOpen
                    ? "bg-card text-card-ink shadow-[var(--shadow-card)]"
                    : "bg-paper-2 text-ink"
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 text-left cursor-pointer"
                >
                  <span
                    className={`font-display text-lg ${
                      isOpen ? "text-card-ink" : "text-ink"
                    }`}
                  >
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition-transform duration-300 motion-reduce:transition-none ${
                      isOpen ? "rotate-180 text-paper" : "text-accent"
                    }`}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: APPLE_EASE }}
                      className="overflow-hidden"
                    >
                      <p className="mt-3 max-w-[44ch] text-sm leading-relaxed text-[var(--color-card-muted)]">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
