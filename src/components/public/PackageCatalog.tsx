"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ArrowRight,
  Clock,
  Sparkles,
  UserCheck,
  Compass,
  GraduationCap,
  Building2,
} from "lucide-react";
import type { CampusType, CategoryDTO, PackageDTO } from "@/lib/types";
import { formatRupiah } from "@/lib/format";

interface PackageCatalogProps {
  categories: CategoryDTO[];
  activeCategoryId: string;
  campusType: CampusType;
  nonTelkomSurcharge: number;
  addonSessionPrice: number;
  highlightedPackageId: string | null;
  onChangeCampusType: (type: CampusType) => void;
  onSelectCategory: (id: string) => void;
  onSelectPackage: (pkg: PackageDTO, category: CategoryDTO) => void;
  onOpenMatcher: () => void;
}

const CHAPTER_THEMES = [
  {
    pillBg: "bg-[#2563EB]",
    accentText: "text-[#2563EB]",
    borderAccent: "border-l-[#2563EB]",
    softBg: "bg-blue-50/90 border-blue-200/80",
    checkBg: "bg-blue-100 text-[#1D4ED8]",
    btnSolid:
      "bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-[0_6px_18px_-6px_rgba(37,99,235,0.6)]",
    badgeFeatured: "bg-[#F97316] text-white",
    badgeNormal: "bg-blue-100 text-[#1D4ED8]",
  },
  {
    pillBg: "bg-[#0D9488]",
    accentText: "text-[#0D9488]",
    borderAccent: "border-l-[#0D9488]",
    softBg: "bg-teal-50/90 border-teal-200/80",
    checkBg: "bg-teal-100 text-[#0F766E]",
    btnSolid:
      "bg-[#0D9488] hover:bg-[#0F766E] text-white shadow-[0_6px_18px_-6px_rgba(13,148,136,0.6)]",
    badgeFeatured: "bg-[#F97316] text-white",
    badgeNormal: "bg-teal-100 text-[#0F766E]",
  },
  {
    pillBg: "bg-[#EA580C]",
    accentText: "text-[#EA580C]",
    borderAccent: "border-l-[#EA580C]",
    softBg: "bg-orange-50/90 border-orange-200/80",
    checkBg: "bg-orange-100 text-[#C2410C]",
    btnSolid:
      "bg-[#EA580C] hover:bg-[#C2410C] text-white shadow-[0_6px_18px_-6px_rgba(234,88,12,0.6)]",
    badgeFeatured: "bg-[#2563EB] text-white",
    badgeNormal: "bg-orange-100 text-[#C2410C]",
  },
];

export function PackageCatalog({
  categories,
  activeCategoryId,
  campusType,
  nonTelkomSurcharge,
  addonSessionPrice,
  highlightedPackageId,
  onChangeCampusType,
  onSelectCategory,
  onSelectPackage,
  onOpenMatcher,
}: PackageCatalogProps) {
  const activeIndex = Math.max(
    0,
    categories.findIndex((c) => c.id === activeCategoryId)
  );
  const activeCategory = categories[activeIndex] ?? categories[0];
  const theme = CHAPTER_THEMES[activeIndex % CHAPTER_THEMES.length];

  if (!activeCategory) {
    return null;
  }

  const surcharge = campusType === "NON_TELKOM" ? nonTelkomSurcharge : 0;

  return (
    <section id="layanan" className="scroll-mt-20 bg-[#F8FAFC] py-20 sm:py-24 paper-grid">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span
              className={`inline-block rounded-md px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-wider text-white ${theme.pillBg}`}
            >
              Katalog Komunikasi Kualitatif
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#090E1A] sm:text-4xl">
              Pilih bagian skripsi yang sedang kamu{" "}
              <span className={`font-serif italic font-normal ${theme.accentText}`}>
                kerjakan
              </span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              Pilih asal kampusmu terlebih dahulu untuk melihat tarif yang berlaku, lalu pilih
              paket Bab 1, Bab 2, atau Bab 3 sesuai kondisi penelitian kualitatifmu.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenMatcher}
            className="inline-flex items-center gap-2 self-start rounded-xl border-2 border-[#090E1A] bg-white px-4 py-2.5 text-xs font-bold text-[#090E1A] shadow-[3px_3px_0px_#090E1A] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#090E1A] md:self-auto cursor-pointer"
          >
            <Compass className="h-4 w-4 text-[#2563EB]" />
            Bantu Cocokkan Kondisi Saya
          </button>
        </div>

        {/* Campus Pricing Switcher (Telkom University FKS vs Non-Telkom) */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border-2 border-[#090E1A] bg-white p-4 shadow-[4px_4px_0px_#090E1A] sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#090E1A] text-[#FDBA74]">
              <GraduationCap className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Kategori Tarif Berdasarkan Kampus
              </p>
              <p className="text-sm font-bold text-[#090E1A]">
                {campusType === "TELKOM_FKS"
                  ? "Menampilkan Tarif Khusus Mahasiswa Telkom University (FKS)"
                  : `Menampilkan Tarif Kampus Swasta Bandung (+${formatRupiah(nonTelkomSurcharge)})`}
              </p>
            </div>
          </div>

          <div className="flex w-full gap-1.5 rounded-xl bg-slate-100 p-1 sm:w-auto">
            <button
              type="button"
              onClick={() => onChangeCampusType("TELKOM_FKS")}
              className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors sm:flex-initial cursor-pointer ${campusType === "TELKOM_FKS"
                ? "text-white"
                : "text-slate-600 hover:text-[#090E1A]"
                }`}
            >
              {campusType === "TELKOM_FKS" && (
                <motion.div
                  layoutId="campusTogglePill"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="absolute inset-0 rounded-lg bg-[#090E1A]"
                />
              )}
              <GraduationCap className="relative z-10 h-3.5 w-3.5" />
              <span className="relative z-10">Telkom Univ (FKS)</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeCampusType("NON_TELKOM")}
              className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors sm:flex-initial cursor-pointer ${campusType === "NON_TELKOM"
                ? "text-white"
                : "text-slate-600 hover:text-[#090E1A]"
                }`}
            >
              {campusType === "NON_TELKOM" && (
                <motion.div
                  layoutId="campusTogglePill"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="absolute inset-0 rounded-lg bg-[#EA580C]"
                />
              )}
              <Building2 className="relative z-10 h-3.5 w-3.5" />
              <span className="relative z-10">
                PTS Bandung (+{formatRupiah(nonTelkomSurcharge)})
              </span>
            </button>
          </div>
        </div>

        {/* High-Contrast Animated Chapter Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 rounded-2xl border-2 border-slate-200 bg-white p-2 shadow-sm">
          {categories.map((cat, idx) => {
            const isActive = cat.id === activeCategory.id;
            const tabTheme = CHAPTER_THEMES[idx % CHAPTER_THEMES.length];
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`relative flex-1 min-w-[165px] rounded-xl px-4 py-3.5 text-left transition-colors duration-200 cursor-pointer ${isActive
                  ? "text-white"
                  : "text-slate-600 hover:bg-slate-50 hover:text-[#090E1A]"
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeChapterTab"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className={`absolute inset-0 rounded-xl shadow-md ${tabTheme.pillBg}`}
                  />
                )}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <div>
                    <span
                      className={`block font-mono text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-white/80" : "text-slate-400"
                        }`}
                    >
                      {cat.shortLabel}
                    </span>
                    <span className="block text-sm font-bold">
                      {cat.name.replace(/^BAB\s*\d+\.\s*/i, "")}
                    </span>
                  </div>
                  <span
                    className={`rounded-lg px-2.5 py-0.5 font-mono text-xs font-bold ${isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-700"
                      }`}
                  >
                    {cat.packages.length}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Category Intro + Package Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8"
          >
            <div
              className={`mb-8 flex flex-col gap-1.5 rounded-xl border border-slate-200 border-l-4 bg-white px-5 py-4 ${theme.borderAccent}`}
            >
              <h3 className="text-lg font-bold text-[#090E1A]">
                {activeCategory.name}
              </h3>
              <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
                {activeCategory.description}
              </p>
            </div>

            <div
              className={`grid gap-6 ${activeCategory.packages.length === 2
                ? "md:grid-cols-2"
                : "md:grid-cols-2 lg:grid-cols-3"
                }`}
            >
              {activeCategory.packages.map((pkg, idx) => {
                const hasDiscount =
                  pkg.discountPrice !== null && pkg.discountPrice < pkg.price;
                const basePrice = hasDiscount ? pkg.discountPrice! : pkg.price;
                const finalPrice = basePrice + surcharge;
                const originalWithSurcharge = pkg.price + surcharge;
                const isHighlighted = highlightedPackageId === pkg.id;
                const isDarkCard = pkg.isFeatured && !isHighlighted;

                return (
                  <motion.article
                    key={pkg.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: idx * 0.07,
                      duration: 0.45,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`group relative flex flex-col justify-between rounded-2xl border-2 p-6 transition-all duration-300 hover:-translate-y-1 ${isHighlighted
                      ? "border-[#10B981] bg-white ring-4 ring-emerald-500/20 shadow-xl"
                      : isDarkCard
                        ? "border-[#090E1A] bg-[#090E1A] text-white shadow-[0_20px_45px_-18px_rgba(9,14,26,0.55)]"
                        : "border-slate-200 bg-white text-[#090E1A] hover:border-slate-400 hover:shadow-lg"
                      }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-slate-400">
                          PAKET 0{idx + 1}
                        </span>
                        {isHighlighted ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#10B981] px-3 py-1 text-[11px] font-bold text-white">
                            <Sparkles className="h-3 w-3" />
                            Rekomendasi Untukmu
                          </span>
                        ) : pkg.badge ? (
                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-bold ${isDarkCard ? theme.badgeFeatured : theme.badgeNormal
                              }`}
                          >
                            {pkg.badge}
                          </span>
                        ) : null}
                      </div>

                      <h4
                        className={`mt-3.5 text-xl font-bold tracking-tight ${isDarkCard ? "text-white" : "text-[#090E1A]"
                          }`}
                      >
                        {pkg.name}
                      </h4>
                      <p
                        className={`mt-2 text-sm leading-relaxed ${isDarkCard ? "text-slate-300" : "text-slate-600"
                          }`}
                      >
                        {pkg.shortDescription}
                      </p>

                      <div
                        className={`mt-5 rounded-xl border p-3.5 ${isDarkCard
                          ? "border-white/15 bg-white/[0.07]"
                          : theme.softBg
                          }`}
                      >
                        <div
                          className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider ${isDarkCard ? "text-[#FDBA74]" : theme.accentText
                            }`}
                        >
                          <UserCheck className="h-3.5 w-3.5" />
                          Cocok jika kamu...
                        </div>
                        <p
                          className={`mt-1.5 text-xs leading-relaxed ${isDarkCard ? "text-slate-200" : "text-slate-700"
                            }`}
                        >
                          {pkg.studentCondition}
                        </p>
                      </div>

                      <div className="mt-5">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Output yang diterima
                        </p>
                        <ul className="mt-3 space-y-2.5">
                          {pkg.outputs.map((output, i) => (
                            <li
                              key={i}
                              className={`flex items-start gap-2.5 text-sm leading-snug ${isDarkCard ? "text-slate-100" : "text-slate-700"
                                }`}
                            >
                              <span
                                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${isDarkCard
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : theme.checkBg
                                  }`}
                              >
                                <Check className="h-2.5 w-2.5" strokeWidth={3} />
                              </span>
                              <span>{output}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* Transparent Session & Follow-up Policy Box */}
                      <div
                        className={`mt-4 rounded-xl border px-3.5 py-2.5 text-[11px] leading-relaxed ${
                          isDarkCard
                            ? "border-white/15 bg-white/[0.06] text-slate-300"
                            : "border-slate-200/80 bg-slate-50 text-slate-600"
                        }`}
                      >
                        {campusType === "TELKOM_FKS" ? (
                          <p className="font-semibold">
                            <span className={isDarkCard ? "text-emerald-400" : "text-[#059669]"}>
                              + Bonus 1x pertemuan follow-up
                            </span>{" "}
                            (khusus Tel-U FKS, bukan via chat berkepanjangan).
                          </p>
                        ) : (
                          <p className="font-semibold">
                            <span className={isDarkCard ? "text-orange-300" : "text-[#C2410C]"}>
                              Khusus PTS wilayah Bandung
                            </span>{" "}
                            (jurusan Komunikasi/Sosial — Kualitatif).
                          </p>
                        )}
                        <p className="mt-0.5">
                          Sesi bimbingan lanjutan di luar kuota paket:{" "}
                          <strong className={isDarkCard ? "text-white" : "text-[#090E1A]"}>
                            +{formatRupiah(addonSessionPrice)}/pertemuan
                          </strong>
                          .
                        </p>
                      </div>
                    </div>

                    {/* Footer: dynamic campus price & CTA */}
                    <div
                      className={`mt-7 border-t pt-5 ${isDarkCard ? "border-white/15" : "border-slate-100"
                        }`}
                    >
                      {pkg.durationLabel && (
                        <div
                          className={`mb-3 flex items-center gap-1.5 text-xs font-medium ${isDarkCard ? "text-slate-300" : "text-slate-500"
                            }`}
                        >
                          <Clock className="h-3.5 w-3.5 opacity-75" />
                          <span>{pkg.durationLabel}</span>
                        </div>
                      )}

                      <div className="flex items-baseline gap-2">
                        <motion.span
                          key={`${pkg.id}-${campusType}`}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`font-mono text-2xl font-bold tracking-tight tabular-nums ${isDarkCard ? "text-white" : "text-[#090E1A]"
                            }`}
                        >
                          {formatRupiah(finalPrice)}
                        </motion.span>
                        {hasDiscount && (
                          <span className="font-mono text-xs text-slate-400 line-through tabular-nums">
                            {formatRupiah(originalWithSurcharge)}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                        {campusType === "TELKOM_FKS"
                          ? "Tarif khusus Telkom University (FKS)"
                          : `Tarif PTS wilayah Bandung (+${formatRupiah(nonTelkomSurcharge)})`}
                      </p>

                      <button
                        type="button"
                        onClick={() => onSelectPackage(pkg, activeCategory)}
                        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 cursor-pointer ${isHighlighted
                          ? "bg-[#10B981] text-white hover:bg-[#059669]"
                          : isDarkCard
                            ? "bg-[#F97316] text-white hover:bg-[#EA580C] shadow-[0_6px_18px_-6px_rgba(249,115,22,0.6)]"
                            : theme.btnSolid
                          }`}
                      >
                        Pilih Paket Ini
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
