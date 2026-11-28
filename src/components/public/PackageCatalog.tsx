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
      className="scroll-mt-20 border-t border-rule bg-paper py-16 sm:py-24"
    >
      <div className="container">
        {/* Compact header */}
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-ink">Pilih paket sesuai babmu.</h2>
            <p className="mt-2 max-w-[40ch] text-base text-ink-2">
              Atur asal kampus dan pilih bab untuk melihat tarif transparan.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenMatcher}
            className="btn-quiet self-start whitespace-nowrap md:self-auto"
          >
            <Compass className="h-4 w-4 text-accent" aria-hidden="true" />
            Cocokkan Paket
          </button>
        </div>

        {/* Interactive Switchers Bar */}
        <div className="mt-8 grid gap-4 lg:grid-cols-12">
          {/* Campus toggle tile */}
          <div className="tile-green flex flex-col justify-between gap-3 p-4 lg:col-span-5 sm:flex-row sm:items-center">
            <span className="text-sm font-bold text-ink">Kampus:</span>
            <div
              role="group"
              aria-label="Pilih kategori kampus"
              className="flex gap-1.5 rounded-2xl bg-paper-3 p-1"
            >
              <button
                type="button"
                onClick={() => onChangeCampusType("TELKOM_FKS")}
                aria-pressed={campusType === "TELKOM_FKS"}
                className={`relative flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-colors duration-200 cursor-pointer ${
                  campusType === "TELKOM_FKS"
                    ? "text-accent-ink"
                    : "text-ink-2 hover:text-ink"
                }`}
              >
                {campusType === "TELKOM_FKS" && (
                  <motion.span
                    layoutId="campusTogglePill"
                    transition={APPLE_SPRING}
                    className="absolute inset-0 rounded-xl bg-accent"
                  />
                )}
                <GraduationCap className="relative z-10 h-3.5 w-3.5" aria-hidden="true" />
                <span className="relative z-10 whitespace-nowrap">Tel-U FKS</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeCampusType("NON_TELKOM")}
                aria-pressed={campusType === "NON_TELKOM"}
                className={`relative flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-colors duration-200 cursor-pointer ${
                  campusType === "NON_TELKOM"
                    ? "text-accent-ink"
                    : "text-ink-2 hover:text-ink"
                }`}
              >
                {campusType === "NON_TELKOM" && (
                  <motion.span
                    layoutId="campusTogglePill"
                    transition={APPLE_SPRING}
                    className="absolute inset-0 rounded-xl bg-accent"
                  />
                )}
                <Building2 className="relative z-10 h-3.5 w-3.5" aria-hidden="true" />
                <span className="relative z-10 whitespace-nowrap">
                  PTS Bandung (+{formatRupiah(nonTelkomSurcharge)})
                </span>
              </button>
            </div>
          </div>

          {/* Chapter tabs */}
          <div
            role="tablist"
            aria-label="Pilih bab pendampingan"
            className="tile-green grid grid-cols-3 gap-1.5 p-1.5 lg:col-span-7"
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
                  className={`relative flex items-center justify-between gap-2 rounded-2xl px-4 py-3 text-left transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? "text-card-ink"
                      : "text-ink-2 hover:text-ink"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeChapterTab"
                      transition={APPLE_SPRING}
                      className="absolute inset-0 rounded-2xl bg-card shadow-sm"
                    />
                  )}
                  <div className="relative z-10 min-w-0">
                    <span className="block text-xs font-bold opacity-75">
                      {cat.shortLabel}
                    </span>
                    <span className="block truncate font-display text-base">
                      {cat.name.replace(/^BAB\s*\d+\.\s*/i, "")}
                    </span>
                  </div>
                  <span
                    className={`num relative z-10 hidden rounded-full px-2.5 py-0.5 text-xs font-bold sm:inline-block ${
                      isActive
                        ? "bg-paper text-ink"
                        : "bg-paper-3 text-ink"
                    }`}
                  >
                    {cat.packages.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Chapter Packages */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: APPLE_EASE }}
            className="mt-8"
          >
            <div
              className={`grid gap-6 ${
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
                const isCreamCard = pkg.isFeatured || isHighlighted;

                return (
                  <motion.article
                    key={pkg.id}
                    initial={false}
                    animate={{ y: 0 }}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.26, ease: APPLE_EASE }}
                    className={`flex flex-col justify-between p-7 transition-colors duration-200 ${
                      isHighlighted
                        ? "surface-card ring-4 ring-accent"
                        : isCreamCard
                          ? "surface-card"
                          : "tile-green hover:bg-paper-2/90"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`num text-xs font-bold ${
                            isCreamCard ? "text-[var(--color-card-muted)]" : "text-muted"
                          }`}
                        >
                          Paket 0{idx + 1}
                        </span>
                        {isHighlighted ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-ink">
                            <Sparkles className="h-3 w-3" aria-hidden="true" />
                            Rekomendasi
                          </span>
                        ) : pkg.badge ? (
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              isCreamCard
                                ? "bg-accent text-accent-ink"
                                : "bg-paper-3 text-ink"
                            }`}
                          >
                            {pkg.badge}
                          </span>
                        ) : null}
                      </div>

                      <h3
                        className={`mt-3 font-display text-2xl leading-snug ${
                          isCreamCard ? "text-card-ink" : "text-ink"
                        }`}
                      >
                        {pkg.name}
                      </h3>
                      <p
                        className={`mt-2 max-w-[34ch] text-sm leading-relaxed ${
                          isCreamCard ? "text-[var(--color-card-muted)]" : "text-ink-2"
                        }`}
                      >
                        {pkg.shortDescription}
                      </p>

                      {/* Compact student fit tag */}
                      <div
                        className={`mt-4 rounded-2xl p-3.5 text-xs leading-relaxed ${
                          isCreamCard
                            ? "bg-paper/10 text-card-ink"
                            : "bg-paper-3 text-ink-2"
                        }`}
                      >
                        <strong
                          className={
                            isCreamCard ? "text-paper" : "text-accent"
                          }
                        >
                          Cocok jika:
                        </strong>{" "}
                        {pkg.studentCondition}
                      </div>

                      <ul className="mt-5 space-y-2">
                        {pkg.outputs.map((output, i) => (
                          <li
                            key={i}
                            className={`flex items-start gap-2.5 text-sm leading-snug ${
                              isCreamCard ? "text-card-ink" : "text-ink"
                            }`}
                          >
                            <Check
                              className={`mt-0.5 h-4 w-4 shrink-0 ${
                                isCreamCard ? "text-paper" : "text-accent"
                              }`}
                              strokeWidth={2.5}
                              aria-hidden="true"
                            />
                            <span>{output}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Price + Policy + CTA */}
                    <div
                      className={`mt-6 border-t pt-5 ${
                        isCreamCard
                          ? "border-[var(--color-card-rule)]"
                          : "border-rule"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-xs font-bold">
                        <span
                          className={
                            isCreamCard
                              ? "text-paper"
                              : "text-accent"
                          }
                        >
                          {campusType === "TELKOM_FKS"
                            ? "+ Bonus 1x follow-up (FKS)"
                            : `PTS Bandung (+${formatRupiah(addonSessionPrice)}/sesi)`}
                        </span>
                        {pkg.durationLabel && (
                          <span
                            className={`inline-flex items-center gap-1 ${
                              isCreamCard
                                ? "text-[var(--color-card-muted)]"
                                : "text-muted"
                            }`}
                          >
                            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                            {pkg.durationLabel}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex items-baseline gap-2.5">
                        <motion.span
                          key={`${pkg.id}-${campusType}`}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.22, ease: APPLE_EASE }}
                          className={`num font-display text-3xl ${
                            isCreamCard ? "text-card-ink" : "text-ink"
                          }`}
                        >
                          {formatRupiah(finalPrice)}
                        </motion.span>
                        {hasDiscount && (
                          <span
                            className={`num text-sm line-through ${
                              isCreamCard
                                ? "text-[var(--color-card-muted)]"
                                : "text-muted"
                            }`}
                          >
                            {formatRupiah(originalWithSurcharge)}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectPackage(pkg, activeCategory)}
                        className={`mt-4 w-full justify-center ${
                          isCreamCard ? "btn-primary" : "btn-quiet"
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
