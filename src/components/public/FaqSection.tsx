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
      q: "Bidang ilmu dan metode penelitian apa saja yang bisa didampingi?",
      a: "Saat ini TelisikRiset berfokus khusus pada rumpun Ilmu Komunikasi (PR, Marketing Communication, Media, Broadcasting, Komunikasi Digital, dsb.) dan khusus menggunakan metode penelitian Kualitatif (studi kasus, fenomenologi, semiotika, analisis wacana, etnografi/netnografi). Kami tidak menerima penelitian kuantitatif atau olah statistik agar pendampingan tetap tajam.",
    },
    {
      q: "Kampus mana saja yang dilayani dan kenapa ada perbedaan tarif?",
      a: `Layanan utama kami dirancang khusus untuk mahasiswa Fakultas Komunikasi dan Ilmu Sosial (FKS) Telkom University dengan tarif khusus ditambah bonus 1x pertemuan follow-up. Untuk di luar Tel-U, saat ini kami hanya melayani mahasiswa kampus swasta wilayah Bandung yang jurusannya relevan (UNISBA, UNPAS, UNIKOM, Widyatama, UNPAR, Maranatha, USB YPKP, ARS, UM Bandung, dsb.) dengan penyesuaian tarif +${formatRupiah(
        nonTelkomSurcharge
      )} per paket.`,
    },
    {
      q: "Apakah TelisikRiset menerima jasa pembuatan skripsi penuh (joki)?",
      a: "Tidak. TelisikRiset berfokus pada konsultasi, brainstorming, pemetaan teori komunikasi, evaluasi metodologi kualitatif, dan pendampingan penyusunan agar kamu memahami dan mampu mempertanggungjawabkan penelitianmu sendiri.",
    },
    {
      q: "Apakah saya harus memesan semua bab sekaligus?",
      a: "Tidak perlu. Sistem paket kami dibuat modular per bab. Kamu bisa memilih hanya Bab 1, Bab 2, atau Bab 3 sesuai titik progres skripsimu saat ini.",
    },
    {
      q: "Bagaimana ketentuan pembatalan, reschedule, dan pengembalian dana (refund)?",
      a: "Reschedule jadwal gratis 1x jika diinformasikan minimal H-1 (24 jam sebelumnya). Pembatalan sepihak sebelum sesi dimulai membuat DP 50% hangus sebagai kompensasi slot dan persiapan (atau refund maks. 50% jika sudah bayar lunas). Untuk sesi yang sudah berjalan, dana tidak dapat dikembalikan (non-refundable). Namun jika mengambil skema DP 50% dan merasa tidak cocok setelah Sesi 1, kamu bebas tidak melanjutkan Sesi 2 tanpa perlu melunasi sisa 50%. Jika pembatalan berasal dari pihak mentor tanpa jadwal pengganti, dana dikembalikan 100%.",
    },
    {
      q: "Kapan saya harus melakukan pembayaran?",
      a: "Setelah mengisi formulir dan memilih skema DP 50% atau bayar lunas, kamu langsung menerima kode pesanan dan detail pembayaran (QRIS atau transfer), lalu mengonfirmasi bukti dan jadwal sesi via Telegram atau LINE.",
    },
  ];

  return (
    <section
      id="faq"
      className="scroll-mt-20 border-t border-rule bg-paper py-20 sm:py-24"
    >
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <h2 className="font-display text-ink">
              Hal yang sering ditanyakan mahasiswa.
            </h2>
            <p className="lead mt-4 text-ink-2">
              Jawaban singkat soal cakupan bidang, tarif kampus, dan kebijakan jadwal.
            </p>
          </div>

          <div className="divide-y divide-rule border-y border-rule lg:col-span-8">
            {faqs.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={item.q} className="py-5">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 py-1 text-left transition-colors duration-200 hover:text-accent active:translate-y-px cursor-pointer"
                  >
                    <span
                      className={`font-display text-lg sm:text-xl ${
                        isOpen ? "text-accent" : "text-ink"
                      }`}
                    >
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-ink transition-transform duration-300 motion-reduce:transition-none ${
                        isOpen ? "rotate-180 text-accent" : ""
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
                        transition={{ duration: 0.32, ease: APPLE_EASE }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-[65ch] pt-3 text-base leading-relaxed text-ink-2">
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
      </div>
    </section>
  );
}
