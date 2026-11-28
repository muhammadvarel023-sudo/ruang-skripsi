"use client";

import { useState } from "react";
import { BookMarked, Users, MessageSquareText } from "lucide-react";

const STEPS = [
  {
    num: "01",
    title: "Pilih Bab & Paket",
    desc: "Cukup pilih Bab 1, Bab 2, atau Bab 3 sesuai titik skripsimu.",
  },
  {
    num: "02",
    title: "Isi Form 1 Menit",
    desc: "Tulis nama, prodi, dan kendala singkat tanpa prosedur rumit.",
  },
  {
    num: "03",
    title: "Konfirmasi Chat",
    desc: "Kode pesanan otomatis siap dikirim ke Telegram atau LINE.",
  },
  {
    num: "04",
    title: "Diskusi 1-on-1",
    desc: "Bedah draft dan susun rencana bimbingan biar lancar ACC.",
  },
];

const PRINCIPLES = [
  {
    icon: BookMarked,
    title: "Berbasis Literatur",
    desc: "Rekomendasi teori dan metode mengacu kaidah ilmiah.",
  },
  {
    icon: Users,
    title: "Kolaboratif 1-on-1",
    desc: "Setiap judul dan kerangka dibahas bersama.",
  },
  {
    icon: MessageSquareText,
    title: "Paham Saat Sidang",
    desc: "Bukan joki, kamu menguasai penelitianmu sendiri.",
  },
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <>
      {/* 2x2 Compact Interactive Steps Bento */}
      <section
        id="cara-kerja"
        className="scroll-mt-20 border-t border-rule bg-paper py-16 sm:py-24"
      >
        <div className="container">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="font-display text-ink">
                Empat langkah ringkas mulai diskusi.
              </h2>
              <p className="mt-3 max-w-[34ch] text-base text-ink-2">
                Dari pilih paket sampai masuk sesi, semua rapi dalam beberapa menit.
              </p>
            </div>

            <ol className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
              {STEPS.map((step, i) => {
                const isActive = activeStep === i;
                return (
                  <li key={step.num}>
                    <button
                      type="button"
                      onClick={() => setActiveStep(i)}
                      onMouseEnter={() => setActiveStep(i)}
                      className={`flex h-full w-full flex-col justify-between rounded-[24px] p-6 text-left transition-colors duration-200 active:translate-y-px cursor-pointer ${
                        isActive
                          ? "bg-card text-card-ink ring-3 ring-accent"
                          : "bg-paper-2 text-ink hover:bg-paper-2/80"
                      }`}
                    >
                      <span
                        className={`num inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-extrabold ${
                          isActive
                            ? "bg-accent text-accent-ink"
                            : "bg-paper-3 text-ink"
                        }`}
                      >
                        {step.num}
                      </span>
                      <div className="mt-4">
                        <h3
                          className={`font-display text-xl ${
                            isActive ? "text-card-ink" : "text-ink"
                          }`}
                        >
                          {step.title}
                        </h3>
                        <p
                          className={`mt-1.5 max-w-[30ch] text-sm leading-relaxed ${
                            isActive
                              ? "text-[var(--color-card-muted)]"
                              : "text-ink-2"
                          }`}
                        >
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

      {/* Oval Medallion + 3 Compact Ethics Bento Tiles */}
      <section
        id="prinsip"
        className="scroll-mt-20 border-t border-rule bg-paper-3 py-16 sm:py-24"
      >
        <div className="container">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <figure
                className="photo-frame frame-oval mx-auto aspect-square max-w-[340px] min-h-[280px] w-full overflow-hidden bg-paper-2"
                data-slot="integrity"
                data-alt="Tangan mencatat di buku catatan di meja kerja"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Writing_in_a_notebook_with_a_feather_pen_while_enjoying_coffee_at_a_desk_surrounded_by_flowers.jpg/1280px-Writing_in_a_notebook_with_a_feather_pen_while_enjoying_coffee_at_a_desk_surrounded_by_flowers.jpg"
                  srcSet="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Writing_in_a_notebook_with_a_feather_pen_while_enjoying_coffee_at_a_desk_surrounded_by_flowers.jpg/960px-Writing_in_a_notebook_with_a_feather_pen_while_enjoying_coffee_at_a_desk_surrounded_by_flowers.jpg 960w, https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Writing_in_a_notebook_with_a_feather_pen_while_enjoying_coffee_at_a_desk_surrounded_by_flowers.jpg/1280px-Writing_in_a_notebook_with_a_feather_pen_while_enjoying_coffee_at_a_desk_surrounded_by_flowers.jpg 1280w, https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Writing_in_a_notebook_with_a_feather_pen_while_enjoying_coffee_at_a_desk_surrounded_by_flowers.jpg/1920px-Writing_in_a_notebook_with_a_feather_pen_while_enjoying_coffee_at_a_desk_surrounded_by_flowers.jpg 1920w"
                  sizes="(min-width: 60rem) 30vw, 85vw"
                  width={6016}
                  height={4016}
                  alt="Tangan mencatat di buku catatan di meja kerja"
                  loading="lazy"
                  style={{ objectPosition: "55% 60%" }}
                />
              </figure>
            </div>

            <div className="lg:col-span-7">
              <h2 className="font-display text-ink">
                Mendampingi berpikir, bukan menggantikanmu.
              </h2>
              <p className="mt-3 max-w-[42ch] text-base text-ink-2">
                TelisikRiset menjaga etika akademik agar kamu percaya diri di depan dosen.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                {PRINCIPLES.map((item) => (
                  <div key={item.title} className="tile-green p-5">
                    <item.icon
                      className="h-5 w-5 text-accent"
                      strokeWidth={2.2}
                      aria-hidden="true"
                    />
                    <h3 className="mt-3 font-display text-lg text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-2">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
