"use client";

import { motion } from "framer-motion";
import { ArrowRight, Compass, ShieldCheck, Layers, GraduationCap } from "lucide-react";

interface HeroProps {
  totalPackages: number;
  onOpenMatcher: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export function Hero({ totalPackages, onOpenMatcher }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#090E1A] text-white dark-grid">
      <div className="h-1 w-full bg-gradient-to-r from-[#2563EB] via-[#10B981] to-[#F97316]" />

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Left high-contrast column */}
          <div className="lg:col-span-7">
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mb-5 flex flex-wrap items-center gap-2"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3.5 py-1.5 text-xs font-semibold text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Khusus Ilmu Komunikasi & Metode Kualitatif
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-400/35 bg-orange-500/15 px-3 py-1.5 text-xs font-semibold text-orange-200">
                <GraduationCap className="h-3.5 w-3.5 text-[#F97316]" />
                Tarif Khusus Telkom University (FKS)
              </span>
            </motion.div>

            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[56px]"
            >
              Pendampingan skripsi{" "}
              <span className="font-serif italic font-normal text-[#FDBA74]">
                komunikasi kualitatif
              </span>{" "}
              yang terstruktur.
            </motion.h1>

            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-[17px]"
            >
              Dirancang khusus untuk mahasiswa{" "}
              <strong className="text-white">
                Fakultas Komunikasi &amp; Ilmu Sosial (FKS) Telkom University
              </strong>{" "}
              (serta terbuka untuk kampus lain dengan sedikit penyesuaian tarif). Pilih bagian{" "}
              <span className="font-semibold text-blue-300">Bab 1</span>,{" "}
              <span className="font-semibold text-emerald-300">Bab 2</span>, atau{" "}
              <span className="font-semibold text-orange-300">Bab 3</span> sesuai progres
              penelitian kualitatifmu.
            </motion.p>

            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-8 flex flex-wrap items-center gap-3.5"
            >
              <a
                href="#layanan"
                className="group inline-flex items-center gap-2 rounded-xl bg-[#F97316] px-6 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_-6px_rgba(249,115,22,0.55)] transition-all duration-200 hover:bg-[#EA580C] hover:-translate-y-0.5"
              >
                Lihat Paket &amp; Tarif
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
              <button
                type="button"
                onClick={onOpenMatcher}
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:border-white/50 hover:bg-white/15 cursor-pointer"
              >
                <Compass className="h-4 w-4 text-[#60A5FA]" />
                Bingung Pilih Paket?
              </button>
            </motion.div>

            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-10 grid grid-cols-3 gap-4 border-t border-white/15 pt-6 sm:max-w-lg"
            >
              <div>
                <p className="font-mono text-xl font-bold text-white tabular-nums">
                  {totalPackages} Paket
                </p>
                <p className="mt-0.5 text-xs text-slate-400">Komunikasi Kualitatif</p>
              </div>
              <div>
                <p className="font-mono text-xl font-bold text-[#34D399]">FKS Tel-U</p>
                <p className="mt-0.5 text-xs text-slate-400">Tarif Spesial Kampus</p>
              </div>
              <div>
                <p className="font-mono text-xl font-bold text-[#FDBA74]">1-on-1</p>
                <p className="mt-0.5 text-xs text-slate-400">Bukan Jasa Joki</p>
              </div>
            </motion.div>
          </div>

          {/* Right crisp white card contrasting sharply against obsidian hero */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="rounded-2xl border-2 border-white/15 bg-white p-6 text-[#090E1A] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#2563EB]">
                    Cakupan Pendampingan
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-[#090E1A]">
                    Fokus Komunikasi &amp; Riset Kualitatif
                  </p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB] text-white">
                  <Layers className="h-5 w-5" />
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {[
                  {
                    code: "BAB 01",
                    title: "Pendahuluan",
                    desc: "Fenomena komunikasi, 2 opsi judul kualitatif, fokus & struktur Bab 1.",
                    tag: "2 Paket",
                    accent: "border-l-[#2563EB] bg-blue-50/70 hover:bg-blue-50",
                    badge: "bg-[#2563EB] text-white",
                    codeColor: "text-[#1D4ED8]",
                  },
                  {
                    code: "BAB 02",
                    title: "Tinjauan Pustaka",
                    desc: "Teori komunikasi & sosial, matriks penelitian terdahulu, research gap, & kerangka.",
                    tag: "3 Paket",
                    accent: "border-l-[#0D9488] bg-teal-50/70 hover:bg-teal-50",
                    badge: "bg-[#0D9488] text-white",
                    codeColor: "text-[#0F766E]",
                  },
                  {
                    code: "BAB 03",
                    title: "Metodologi Kualitatif",
                    desc: "Paradigma, studi kasus, fenomenologi, semiotika, wacana, informan & triangulasi.",
                    tag: "2 Paket",
                    accent: "border-l-[#EA580C] bg-orange-50/70 hover:bg-orange-50",
                    badge: "bg-[#EA580C] text-white",
                    codeColor: "text-[#C2410C]",
                  },
                ].map((item, idx) => (
                  <motion.a
                    key={item.code}
                    href="#layanan"
                    initial={{ opacity: 0, x: 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.3 + idx * 0.08,
                      duration: 0.45,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`group block rounded-xl border border-slate-200/80 border-l-4 p-3.5 transition-all duration-200 ${item.accent}`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-mono text-[11px] font-bold tracking-wider ${item.codeColor}`}
                      >
                        {item.code}
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${item.badge}`}
                      >
                        {item.tag}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-bold text-[#090E1A]">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
                      {item.desc}
                    </p>
                  </motion.a>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-2.5 rounded-xl bg-[#090E1A] px-4 py-3 text-xs text-slate-200">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>
                  Saat ini kami <strong className="text-white">khusus menangani Ilmu Komunikasi (Kualitatif)</strong> agar pendampingan tetap tajam &amp; relevan.
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
