"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookMarked, Users, MessageSquareText } from "lucide-react";
import { APPLE_EASE, APPLE_SPRING } from "@/lib/motion";

const STEPS = [
  {
    title: "Pilih Bab & Paket Sesuai Progres",
    desc: "Cukup pilih bagian yang sedang kamu kerjakan (Bab 1, Bab 2, atau Bab 3) sesuai kondisi awal penelitianmu.",
  },
  {
    title: "Isi Detail Singkat Penelitian",
    desc: "Tulis nama, prodi, pendekatan kualitatif, serta topik atau kendala singkat dalam formulir kurang dari satu menit.",
  },
  {
    title: "Konfirmasi Terarah via Telegram atau LINE",
    desc: "Sistem otomatis membuat kode pesanan dan format pesan, tinggal klik Telegram atau LINE tanpa perlu nomor HP.",
  },
  {
    title: "Mulai Sesi Pendampingan 1-on-1",
    desc: "Diskusi, brainstorming, evaluasi draft, dan penyusunan rencana tindak lanjut agar kamu siap maju bimbingan.",
  },
];

const PRINCIPLES = [
  {
    icon: BookMarked,
    title: "Berbasis Literatur & Logika Riset",
    desc: "Rekomendasi teori dan metode mengacu pada kaidah metodologi ilmiah.",
  },
  {
    icon: Users,
    title: "Kolaboratif 1-on-1",
    desc: "Setiap keputusan judul, kerangka, dan analisis didiskusikan bersama.",
  },
  {
    icon: MessageSquareText,
    title: "Siap Dipertanggungjawabkan",
    desc: "Fokus membangun pemahaman agar kamu lancar menjawab pertanyaan penguji.",
  },
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <>
      <section
        id="cara-kerja"
        className="scroll-mt-20 border-t border-rule bg-paper-2 py-20 sm:py-24"
      >
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <h2 className="font-display text-ink">
                Alur pendampingan sederhana, tanpa prosedur berbelit.
              </h2>
              <p className="lead mt-4 text-ink-2">
                Empat langkah ringkas dari memilih bab hingga masuk ruang diskusi 1-on-1.
              </p>
            </div>

            <ol className="divide-y divide-rule border-y border-rule lg:col-span-7">
              {STEPS.map((step, i) => {
                const isActive = activeStep === i;
                return (
                  <li key={step.title}>
                    <button
                      type="button"
                      onClick={() => setActiveStep(i)}
                      onMouseEnter={() => setActiveStep(i)}
                      className="group relative flex w-full items-start gap-6 py-6 text-left transition-colors duration-200 cursor-pointer"
                    >
                      {isActive && (
                        <motion.span
                          layoutId="activeStepRule"
                          transition={APPLE_SPRING}
                          className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-accent"
                        />
                      )}
                      <span
                        className={`num pl-4 font-display text-2xl transition-colors duration-200 ${
                          isActive ? "text-accent" : "text-muted"
                        }`}
                      >
                        0{i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-xl text-ink">
                          {step.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
                          {step.desc}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* Deep Espresso Ink Band: Academic Integrity + Oval Photo Medallion */}
      <section
        id="prinsip"
        className="band-ink scroll-mt-20 py-20 sm:py-28"
      >
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Oval medallion photograph contrasting against espresso band */}
            <motion.div
              initial={false}
              animate={{ y: 0 }}
              transition={{ duration: 0.55, ease: APPLE_EASE }}
              className="lg:col-span-5"
            >
              <figure
                className="photo-frame frame-oval mx-auto aspect-square max-w-[380px] min-h-[300px] w-full overflow-hidden border border-paper/20 bg-ink"
                data-slot="integrity"
                data-alt="Tangan mencatat di buku catatan di meja kerja"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Writing_in_a_notebook_with_a_feather_pen_while_enjoying_coffee_at_a_desk_surrounded_by_flowers.jpg/1280px-Writing_in_a_notebook_with_a_feather_pen_while_enjoying_coffee_at_a_desk_surrounded_by_flowers.jpg"
                  srcSet="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Writing_in_a_notebook_with_a_feather_pen_while_enjoying_coffee_at_a_desk_surrounded_by_flowers.jpg/960px-Writing_in_a_notebook_with_a_feather_pen_while_enjoying_coffee_at_a_desk_surrounded_by_flowers.jpg 960w, https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Writing_in_a_notebook_with_a_feather_pen_while_enjoying_coffee_at_a_desk_surrounded_by_flowers.jpg/1280px-Writing_in_a_notebook_with_a_feather_pen_while_enjoying_coffee_at_a_desk_surrounded_by_flowers.jpg 1280w, https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Writing_in_a_notebook_with_a_feather_pen_while_enjoying_coffee_at_a_desk_surrounded_by_flowers.jpg/1920px-Writing_in_a_notebook_with_a_feather_pen_while_enjoying_coffee_at_a_desk_surrounded_by_flowers.jpg 1920w"
                  sizes="(min-width: 60rem) 34vw, 90vw"
                  width={6016}
                  height={4016}
                  alt="Tangan mencatat di buku catatan di meja kerja"
                  loading="lazy"
                  style={{ objectPosition: "55% 60%" }}
                />
              </figure>
            </motion.div>

            <div className="lg:col-span-7">
              <h2 className="font-display text-paper">
                Kami mendampingi proses berpikir, bukan menggantikan peranmu.
              </h2>
              <p className="lead mt-4 text-paper/85">
                TelisikRiset dibangun sebagai ruang diskusi akademik agar kamu menguasai
                logika penelitian, teori, dan metodologimu sendiri saat bimbingan maupun sidang.
              </p>

              <dl className="mt-8 divide-y divide-paper/15 border-y border-paper/15">
                {PRINCIPLES.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 py-5"
                  >
                    <item.icon
                      className="mt-1 h-5 w-5 shrink-0 text-gold"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    <div>
                      <dt className="font-display text-lg text-paper">
                        {item.title}
                      </dt>
                      <dd className="mt-1 text-sm leading-relaxed text-paper/80">
                        {item.desc}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
