"use client";

import { motion } from "framer-motion";
import { ShieldCheck, BookMarked, Users, MessageSquareText } from "lucide-react";

const STEPS = [
  {
    num: "01",
    title: "Pilih Bab & Paket Sesuai Progres",
    desc: "Cukup pilih bagian yang sedang kamu kerjakan (Bab 1, Bab 2, atau Bab 3) sesuai kondisi awal penelitianmu.",
    badge: "bg-[#2563EB] text-white",
    border: "border-t-[#2563EB]",
  },
  {
    num: "02",
    title: "Isi Detail Singkat Penelitian",
    desc: "Tulis nama, prodi, pendekatan penelitian, serta topik atau kendala singkat dalam formulir kurang dari 1 menit.",
    badge: "bg-[#0D9488] text-white",
    border: "border-t-[#0D9488]",
  },
  {
    num: "03",
    title: "Konfirmasi Terarah via WhatsApp",
    desc: "Sistem otomatis membuat kode pesanan dan pesan ringkasan—kamu tinggal klik konfirmasi tanpa menjelaskan ulang.",
    badge: "bg-[#EA580C] text-white",
    border: "border-t-[#EA580C]",
  },
  {
    num: "04",
    title: "Mulai Sesi Pendampingan 1-on-1",
    desc: "Diskusi, brainstorming, evaluasi draft, dan penyusunan rencana tindak lanjut agar kamu siap maju bimbingan.",
    badge: "bg-[#090E1A] text-white",
    border: "border-t-[#090E1A]",
  },
];

export function HowItWorks() {
  return (
    <>
      <section
        id="cara-kerja"
        className="scroll-mt-20 border-t border-slate-200 bg-white py-20 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block rounded-md bg-[#090E1A] px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-wider text-white">
              Alur Pendampingan
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#090E1A] sm:text-4xl">
              Sederhana, rapi, tanpa{" "}
              <span className="font-serif italic font-normal text-[#2563EB]">
                prosedur berbelit.
              </span>
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  delay: i * 0.08,
                  duration: 0.48,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`rounded-2xl border border-slate-200 border-t-4 bg-[#F8FAFC] p-6 transition-all hover:bg-white hover:shadow-md ${step.border}`}
              >
                <span
                  className={`inline-block rounded-lg px-2.5 py-1 font-mono text-xs font-bold ${step.badge}`}
                >
                  LANGKAH {step.num}
                </span>
                <h3 className="mt-4 text-base font-bold text-[#090E1A]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bold High-Contrast Academic Integrity Banner */}
      <section id="prinsip" className="scroll-mt-20 border-t border-slate-200 bg-[#F8FAFC] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-3xl bg-[#090E1A] p-8 text-white shadow-2xl sm:p-12 dark-grid"
          >
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3.5 py-1 text-xs font-bold text-emerald-300">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  Komitmen Etika Akademik
                </span>
                <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                  Kami mendampingi proses berpikir,{" "}
                  <span className="font-serif italic font-normal text-[#FDBA74]">
                    bukan menggantikan peranmu.
                  </span>
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
                  RuangSkripsi dibangun sebagai ruang diskusi dan mentoring akademik. Tujuan kami
                  bukan sekadar menghasilkan halaman naskah, melainkan memastikan kamu memahami
                  logika penelitian, teori, dan metodologimu sendiri—sehingga percaya diri saat
                  bimbingan maupun sidang.
                </p>
              </div>

              <div className="grid gap-3.5 lg:col-span-5">
                {[
                  {
                    icon: BookMarked,
                    color: "bg-[#2563EB] text-white",
                    title: "Berbasis Literatur & Logika Riset",
                    desc: "Rekomendasi teori dan metode mengacu pada kaidah metodologi ilmiah.",
                  },
                  {
                    icon: Users,
                    color: "bg-[#0D9488] text-white",
                    title: "Kolaboratif 1-on-1",
                    desc: "Setiap keputusan judul, kerangka, dan analisis didiskusikan bersama.",
                  },
                  {
                    icon: MessageSquareText,
                    color: "bg-[#F97316] text-white",
                    title: "Siap Dipertanggungjawabkan",
                    desc: "Fokus membangun pemahaman agar kamu lancar menjawab pertanyaan penguji.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3.5 rounded-2xl border border-white/15 bg-white/[0.06] p-4"
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.color}`}
                    >
                      <item.icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white">{item.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-300">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
