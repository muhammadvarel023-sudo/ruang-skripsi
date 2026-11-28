"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Clock, Sparkles, Compass, GraduationCap, Building2 } from "lucide-react";
import type { CampusType, CategoryDTO, PackageDTO } from "@/lib/types";
import { formatRupiah } from "@/lib/format";
import { APPLE_EASE, APPLE_SPRING } from "@/lib/motion";

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

  if (!activeCategory) {
    return null;
  }

  const surcharge = campusType === "NON_TELKOM" ? nonTelkomSurcharge : 0;

  return (
    <section
      id="layanan"
      className="scroll-mt-20 border-t border-rule bg-paper-2 py-20 sm:py-24"
    >
      <div className="container">
        {/* Section header: editorial left-aligned with action on right */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <h2 className="font-display text-ink">
              Pilih bagian skripsi yang sedang dikerjakan.
            </h2>
            <p className="lead mt-4 text-ink-2">
              Tentukan asal kampus untuk melihat tarif yang berlaku, lalu pilih paket Bab 1,
              Bab 2, atau Bab 3 sesuai progres penelitian kualitatifmu.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenMatcher}
            className="btn-quiet self-start whitespace-nowrap lg:self-auto"
          >
            <Compass className="h-4 w-4 text-accent" aria-hidden="true" />
            Cocokkan Paket
          </button>
        </div>

        {/* Interactive Campus Switcher */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-y border-rule py-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-ink">
              Kategori tarif berdasarkan kampus
            </p>
            <p className="mt-0.5 text-sm text-ink-2">
              {campusType === "TELKOM_FKS"
                ? "Menampilkan tarif khusus mahasiswa Telkom University (FKS)"
                : `Menampilkan tarif PTS Bandung (+${formatRupiah(nonTelkomSurcharge)})`}
            </p>
          </div>

          <div
            role="group"
            aria-label="Pilih kategori kampus"
            className="flex w-full gap-1 rounded-full border border-rule bg-paper p-1 sm:w-auto"
          >
            <button
              type="button"
              onClick={() => onChangeCampusType("TELKOM_FKS")}
              aria-pressed={campusType === "TELKOM_FKS"}
              className={`relative flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors duration-200 sm:flex-initial cursor-pointer ${
                campusType === "TELKOM_FKS"
                  ? "text-accent-ink"
                  : "text-ink-2 hover:text-ink"
              }`}
            >
              {campusType === "TELKOM_FKS" && (
                <motion.span
                  layoutId="campusTogglePill"
                  transition={APPLE_SPRING}
                  className="absolute inset-0 rounded-full bg-ink"
                />
              )}
              <GraduationCap className="relative z-10 h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="relative z-10 whitespace-nowrap">Telkom Univ (FKS)</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeCampusType("NON_TELKOM")}
              aria-pressed={campusType === "NON_TELKOM"}
              className={`relative flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors duration-200 sm:flex-initial cursor-pointer ${
                campusType === "NON_TELKOM"
                  ? "text-accent-ink"
                  : "text-ink-2 hover:text-ink"
              }`}
            >
              {campusType === "NON_TELKOM" && (
                <motion.span
                  layoutId="campusTogglePill"
                  transition={APPLE_SPRING}
                  className="absolute inset-0 rounded-full bg-accent"
                />
              )}
              <Building2 className="relative z-10 h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="relative z-10 whitespace-nowrap">
                PTS Bandung (+{formatRupiah(nonTelkomSurcharge)})
              </span>
            </button>
          </div>
        </div>

        {/* Interactive Chapter Tabs */}
        <div
          role="tablist"
          aria-label="Pilih bab pendampingan"
          className="mt-8 grid gap-2 sm:grid-cols-3"
        >
          {categories.map((cat) => {
            const isActive = cat.id === activeCategory.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectCategory(cat.id)}
                className={`relative flex items-center justify-between gap-3 border px-5 py-4 text-left transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? "border-ink text-paper"
                    : "border-rule bg-paper text-ink hover:border-ink/50"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeChapterTab"
                    transition={APPLE_SPRING}
                    className="absolute inset-0 bg-ink"
                  />
                )}
                <div className="relative z-10 min-w-0">
                  <span
                    className={`block text-xs font-semibold ${
                      isActive ? "text-gold-2" : "text-muted"
                    }`}
                  >
                    {cat.shortLabel}
                  </span>
                  <span className="mt-0.5 block truncate font-display text-lg">
                    {cat.name.replace(/^BAB\s*\d+\.\s*/i, "")}
                  </span>
                </div>
                <span
                  className={`num relative z-10 shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                    isActive
                      ? "bg-paper/15 text-paper"
                      : "bg-paper-3 text-ink"
                  }`}
                >
                  {cat.packages.length} paket
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Chapter Intro + Packages */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.34, ease: APPLE_EASE }}
            className="mt-8"
          >
            <div className="mb-8 border-l-2 border-accent pl-5 py-1">
              <h3 className="font-display text-2xl text-ink">{activeCategory.name}</h3>
              <p className="mt-1.5 max-w-3xl text-base text-ink-2">
                {activeCategory.description}
              </p>
            </div>

            <div
              className={`grid gap-8 ${
                activeCategory.packages.length === 2
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
                    initial={false}
                    animate={{ y: 0 }}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.28, ease: APPLE_EASE }}
                    className={`flex flex-col justify-between p-7 transition-colors duration-200 ${
                      isHighlighted
                        ? "well-solstice ring-2 ring-accent"
                        : isDarkCard
                          ? "border-2 border-ink bg-ink text-paper"
                          : "border border-rule bg-paper text-ink hover:border-ink/60"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 border-b pb-4 border-current/15">
                        <span
                          className={`num text-sm font-semibold ${
                            isDarkCard ? "text-gold-2" : "text-muted"
                          }`}
                        >
                          Paket 0{idx + 1}
                        </span>
                        {isHighlighted ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-ink">
                            <Sparkles className="h-3 w-3" aria-hidden="true" />
                            Rekomendasi Untukmu
                          </span>
                        ) : pkg.badge ? (
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              isDarkCard
                                ? "bg-gold text-ink"
                                : "bg-paper-3 text-ink"
                            }`}
                          >
                            {pkg.badge}
                          </span>
                        ) : null}
                      </div>

                      <h4
                        className={`mt-5 font-display text-2xl leading-snug ${
                          isDarkCard ? "text-paper" : "text-ink"
                        }`}
                      >
                        {pkg.name}
                      </h4>
                      <p
                        className={`mt-2.5 text-sm leading-relaxed ${
                          isDarkCard ? "text-paper/85" : "text-ink-2"
                        }`}
                      >
                        {pkg.shortDescription}
                      </p>

                      {/* Left-ruled student condition note (no card inside card) */}
                      <div
                        className={`mt-5 border-l-2 pl-3.5 ${
                          isDarkCard ? "border-gold" : "border-accent"
                        }`}
                      >
                        <p
                          className={`text-xs font-semibold ${
                            isDarkCard ? "text-gold-2" : "text-accent"
                          }`}
                        >
                          Cocok jika kamu…
                        </p>
                        <p
                          className={`mt-1 text-sm leading-relaxed ${
                            isDarkCard ? "text-paper/90" : "text-ink-2"
                          }`}
                        >
                          {pkg.studentCondition}
                        </p>
                      </div>

                      <div className="mt-6">
                        <p
                          className={`text-xs font-semibold ${
                            isDarkCard ? "text-paper/75" : "text-muted"
                          }`}
                        >
                          Output yang diterima
                        </p>
                        <ul className="mt-3 space-y-2.5">
                          {pkg.outputs.map((output, i) => (
                            <li
                              key={i}
                              className={`flex items-start gap-2.5 text-sm leading-snug ${
                                isDarkCard ? "text-paper" : "text-ink"
                              }`}
                            >
                              <Check
                                className={`mt-0.5 h-4 w-4 shrink-0 ${
                                  isDarkCard ? "text-gold" : "text-accent"
                                }`}
                                strokeWidth={2.5}
                                aria-hidden="true"
                              />
                              <span>{output}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Transparent Session & Follow-up Policy line */}
                      <div
                        className={`mt-6 border-t pt-4 text-xs leading-relaxed ${
                          isDarkCard
                            ? "border-paper/15 text-paper/80"
                            : "border-rule text-ink-2"
                        }`}
                      >
                        {campusType === "TELKOM_FKS" ? (
                          <p>
                            <strong
                              className={
                                isDarkCard ? "text-gold-2" : "text-ink"
                              }
                            >
                              Bonus 1x pertemuan follow-up
                            </strong>{" "}
                            khusus Tel-U FKS (bukan chat berkepanjangan).
                          </p>
                        ) : (
                          <p>
                            <strong
                              className={
                                isDarkCard ? "text-gold-2" : "text-accent"
                              }
                            >
                              Khusus PTS wilayah Bandung
                            </strong>{" "}
                            (jurusan Komunikasi atau Sosial kualitatif).
                          </p>
                        )}
                        <p className="mt-1">
                          Sesi lanjutan di luar kuota:{" "}
                          <strong className={isDarkCard ? "text-paper" : "text-ink"}>
                            +{formatRupiah(addonSessionPrice)}/pertemuan
                          </strong>
                          .
                        </p>
                      </div>
                    </div>

                    {/* Footer: dynamic campus price & CTA */}
                    <div
                      className={`mt-7 border-t pt-5 ${
                        isDarkCard ? "border-paper/20" : "border-rule"
                      }`}
                    >
                      {pkg.durationLabel && (
                        <div
                          className={`mb-3 flex items-center gap-1.5 text-xs font-medium ${
                            isDarkCard ? "text-paper/75" : "text-muted"
                          }`}
                        >
                          <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          <span>{pkg.durationLabel}</span>
                        </div>
                      )}

                      <div className="flex items-baseline gap-2.5">
                        <motion.span
                          key={`${pkg.id}-${campusType}`}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.24, ease: APPLE_EASE }}
                          className={`num font-display text-3xl ${
                            isDarkCard ? "text-paper" : "text-ink"
                          }`}
                        >
                          {formatRupiah(finalPrice)}
                        </motion.span>
                        {hasDiscount && (
                          <span
                            className={`num text-sm line-through ${
                              isDarkCard ? "text-paper/55" : "text-muted"
                            }`}
                          >
                            {formatRupiah(originalWithSurcharge)}
                          </span>
                        )}
                      </div>

                      <p
                        className={`mt-1 text-xs ${
                          isDarkCard ? "text-paper/75" : "text-muted"
                        }`}
                      >
                        {campusType === "TELKOM_FKS"
                          ? "Tarif khusus Telkom University (FKS)"
                          : `Tarif PTS wilayah Bandung (+${formatRupiah(nonTelkomSurcharge)})`}
                      </p>

                      <button
                        type="button"
                        onClick={() => onSelectPackage(pkg, activeCategory)}
                        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full min-h-[48px] px-5 text-sm font-semibold transition-colors duration-200 active:translate-y-px cursor-pointer ${
                          isHighlighted || isDarkCard
                            ? "bg-accent text-accent-ink hover:bg-accent/90"
                            : "border border-ink bg-transparent text-ink hover:bg-ink hover:text-paper"
                        }`}
                      >
                        Pilih Paket Ini
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
