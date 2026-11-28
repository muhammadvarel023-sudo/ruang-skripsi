"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { APPLE_EASE, APPLE_SPRING } from "@/lib/motion";

interface ThesisFlowDiagramProps {
  onJumpToChapter: (chapterIndex: number) => void;
}

const FLOW_NODES = [
  {
    id: "bab-1",
    step: "01",
    title: "Fenomena & Judul",
    short: "Bab 1",
    chapterIndex: 0,
    goal: "Mengunci topik komunikasi yang unik dan lolos ACC awal.",
    chips: ["2 Opsi Judul", "Rumusan Masalah", "Mini Outline"],
  },
  {
    id: "bab-2",
    step: "02",
    title: "Teori & Research Gap",
    short: "Bab 2",
    chapterIndex: 1,
    goal: "Menyambungkan grand theory dengan riset terdahulu.",
    chips: ["Matriks Riset", "Research Gap", "Bagan Kerangka"],
  },
  {
    id: "bab-3",
    step: "03",
    title: "Desain Kualitatif",
    short: "Bab 3",
    chapterIndex: 2,
    goal: "Menentukan paradigma, informan, serta teknik analisis.",
    chips: ["Kisi Wawancara", "Unit Analisis", "Triangulasi"],
  },
  {
    id: "sidang",
    step: "04",
    title: "Siap Bimbingan",
    short: "Output Akhir",
    chapterIndex: 0,
    goal: "Kamu paham alur berpikir risetmu saat ditanya penguji.",
    chips: ["Paham Logika", "Siap Revisi", "1-on-1 Follow-up"],
  },
];

export function ThesisFlowDiagram({ onJumpToChapter }: ThesisFlowDiagramProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = FLOW_NODES[activeIdx];

  return (
    <section
      id="peta-riset"
      aria-label="Bagan interaktif peta penyusunan skripsi"
      className="scroll-mt-20 border-t border-rule bg-paper-3 py-16 sm:py-20"
    >
      <div className="container">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-ink">Peta jalan skripsimu.</h2>
            <p className="mt-2 max-w-[38ch] text-base text-ink-2">
              Klik kotak mana saja pada bagan untuk melihat output nyatanya.
            </p>
          </div>
          <span className="small-print rounded-full bg-paper-2 px-4 py-2 text-xs font-bold text-ink">
            Bagan interaktif Bab 1 sampai Bab 3
          </span>
        </div>

        {/* Connected Interactive Flowchart Nodes */}
        <div className="relative mt-10">
          {/* Connecting SVG progress path behind nodes on desktop */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1200 40"
            preserveAspectRatio="none"
            className="pointer-events-none absolute left-0 right-0 top-12 hidden h-10 w-full lg:block"
          >
            <line
              x1="120"
              y1="20"
              x2="1080"
              y2="20"
              stroke="var(--color-rule)"
              strokeWidth="3"
              strokeDasharray="8 8"
            />
            <motion.line
              x1="120"
              y1="20"
              x2={120 + activeIdx * 320}
              y2="20"
              stroke="var(--color-accent)"
              strokeWidth="4"
              transition={APPLE_SPRING}
            />
          </svg>

          <div className="relative z-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FLOW_NODES.map((node, idx) => {
              const isActive = idx === activeIdx;
              const isPassed = idx <= activeIdx;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`group relative flex flex-col justify-between rounded-[24px] p-5 text-left transition-colors duration-200 active:translate-y-px cursor-pointer ${
                    isActive
                      ? "bg-card text-card-ink shadow-[var(--shadow-card)] ring-3 ring-accent"
                      : "bg-paper-2 text-ink hover:bg-paper"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`num inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-extrabold ${
                        isPassed
                          ? "bg-accent text-accent-ink"
                          : "bg-paper-3 text-ink-2"
                      }`}
                    >
                      {node.step}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        isActive
                          ? "bg-paper text-ink"
                          : "bg-paper-3 text-ink-2"
                      }`}
                    >
                      {node.short}
                    </span>
                  </div>

                  <div className="mt-5">
                    <h3
                      className={`font-display text-xl ${
                        isActive ? "text-card-ink" : "text-ink"
                      }`}
                    >
                      {node.title}
                    </h3>
                    <p
                      className={`mt-1.5 text-xs leading-relaxed ${
                        isActive ? "text-[var(--color-card-muted)]" : "text-ink-2"
                      }`}
                    >
                      {node.goal}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Node Output Strip */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: APPLE_EASE }}
            className="mt-6 flex flex-col items-start justify-between gap-4 rounded-[24px] bg-paper-2 p-5 sm:flex-row sm:items-center sm:p-6"
          >
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-sm font-bold text-ink">
                Fokus {current.short}:
              </span>
              {current.chips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-1.5 rounded-full bg-paper-3 px-3.5 py-1.5 text-xs font-bold text-ink"
                >
                  <Check className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                  {chip}
                </span>
              ))}
            </div>

            <a
              href="#layanan"
              onClick={() => onJumpToChapter(current.chapterIndex)}
              className="btn-primary shrink-0 text-sm"
            >
              Lihat Paket {current.short === "Output Akhir" ? "Terkait" : current.short}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
