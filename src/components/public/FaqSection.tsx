"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { formatRupiah } from "@/lib/format";

export function FaqSection({
  nonTelkomSurcharge,
}: {
  nonTelkomSurcharge: number;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Bidang ilmu dan metode penelitian apa saja yang bisa didampingi?",
      a: "Saat ini RuangSkripsi berfokus khusus pada rumpun Ilmu Komunikasi (PR, Marketing Communication, Media, Broadcasting, Komunikasi Digital, dsb.) dan khusus menggunakan metode penelitian Kualitatif (studi kasus, fenomenologi, semiotika, analisis wacana, etnografi/netnografi). Kami tidak menerima penelitian kuantitatif/olah statistik agar pendampingan tetap tajam.",
    },
    {
      q: "Kampus mana saja yang dilayani dan kenapa ada perbedaan tarif?",
      a: `Layanan utama kami dirancang khusus untuk mahasiswa Fakultas Komunikasi & Ilmu Sosial (FKS) Telkom University dengan tarif khusus + bonus 1x pertemuan follow-up. Untuk di luar Tel-U, saat ini kami hanya melayani mahasiswa kampus swasta wilayah Bandung yang jurusannya relevan (UNISBA, UNPAS, UNIKOM, Widyatama, UNPAR, Maranatha, USB YPKP, ARS, UM Bandung, dsb.) dengan penyesuaian tarif +${formatRupiah(
        nonTelkomSurcharge
      )} per paket.`,
    },
    {
      q: "Apakah RuangSkripsi menerima jasa pembuatan skripsi penuh (joki)?",
      a: "Tidak. RuangSkripsi berfokus pada konsultasi, brainstorming, pemetaan teori komunikasi, evaluasi metodologi kualitatif, dan pendampingan penyusunan agar kamu memahami dan mampu mempertanggungjawabkan penelitianmu sendiri.",
    },
    {
      q: "Apakah saya harus memesan semua bab sekaligus?",
      a: "Tidak perlu. Sistem paket kami dibuat modular per bab. Kamu bisa memilih hanya Bab 1, Bab 2, atau Bab 3 sesuai titik progres skripsimu saat ini.",
    },
    {
      q: "Bagaimana ketentuan pembatalan, reschedule, dan pengembalian dana (refund)?",
      a: "Reschedule jadwal gratis 1x jika diinformasikan minimal H-1 (24 jam sebelumnya). Pembatalan sepihak sebelum sesi dimulai membuat DP 50% hangus sebagai kompensasi slot & persiapan (atau refund maks. 50% jika sudah bayar lunas). Untuk sesi yang sudah berjalan, dana tidak dapat dikembalikan (non-refundable)—namun jika mengambil skema DP 50% dan merasa tidak cocok setelah Sesi 1, kamu bebas tidak melanjutkan Sesi 2 tanpa perlu melunasi sisa 50%. Jika pembatalan berasal dari pihak mentor tanpa jadwal pengganti, dana dikembalikan 100%.",
    },
    {
      q: "Kapan saya harus melakukan pembayaran?",
      a: "Tidak ada pembayaran langsung saat mengirim formulir di website. Setelah kamu mengirim permintaan dan melakukan konfirmasi via Telegram atau LINE, admin akan memastikan kecocokan paket dan jadwal sesi terlebih dahulu.",
    },
  ];

  return (
    <section id="faq" className="scroll-mt-20 border-t border-slate-200 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-block rounded-md bg-[#2563EB] px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-wider text-white">
            Pertanyaan Umum
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#090E1A]">
            Hal yang sering ditanyakan mahasiswa
          </h2>
        </div>

        <div className="mt-10 divide-y divide-slate-200 rounded-2xl border-2 border-slate-200 bg-[#F8FAFC]">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`px-5 py-4 transition-colors sm:px-6 ${isOpen ? "bg-white" : ""
                  }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 text-left cursor-pointer"
                >
                  <span
                    className={`text-sm font-bold sm:text-[15px] ${isOpen ? "text-[#2563EB]" : "text-[#090E1A]"
                      }`}
                  >
                    {item.q}
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${isOpen
                      ? "bg-[#2563EB] text-white"
                      : "bg-slate-200/80 text-slate-600"
                      }`}
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                        }`}
                    />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pt-3 text-sm leading-relaxed text-slate-600">
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
