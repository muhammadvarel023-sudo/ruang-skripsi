"use client";

import { useState } from "react";
import { MotionConfig } from "framer-motion";
import type { CampusType, CategoryDTO, PackageDTO, SiteSettings } from "@/lib/types";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { ThesisFlowDiagram } from "./ThesisFlowDiagram";
import { PackageCatalog } from "./PackageCatalog";
import { ChapterShowcase } from "./ChapterShowcase";
import { HowItWorks } from "./HowItWorks";
import { FaqSection } from "./FaqSection";
import { Footer } from "./Footer";
import { QuickMatcherModal } from "./QuickMatcherModal";
import { OrderDrawer } from "./OrderDrawer";

interface HomeClientProps {
  categories: CategoryDTO[];
  settings: SiteSettings;
}

export function HomeClient({ categories, settings }: HomeClientProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    categories[0]?.id ?? ""
  );
  const [campusType, setCampusType] = useState<CampusType>("TELKOM_FKS");
  const [highlightedPackageId, setHighlightedPackageId] = useState<string | null>(
    null
  );
  const [matcherOpen, setMatcherOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<{
    pkg: PackageDTO;
    category: CategoryDTO;
  } | null>(null);

  const totalPackages = categories.reduce(
    (sum, cat) => sum + cat.packages.length,
    0
  );

  const jumpToChapter = (chapterIndex: number) => {
    const target = categories[chapterIndex];
    if (target) {
      setActiveCategoryId(target.id);
      setHighlightedPackageId(null);
    }
    const el = document.getElementById("layanan");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleRecommend = (categoryId: string, packageId: string) => {
    setActiveCategoryId(categoryId);
    setHighlightedPackageId(packageId);
    setMatcherOpen(false);
    const el = document.getElementById("layanan");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-paper text-ink">
        <Navbar
          brandName={settings.brand_name}
          onOpenMatcher={() => setMatcherOpen(true)}
        />

        <main id="main-content" className="flex-1">
          <Hero
            categories={categories}
            totalPackages={totalPackages}
            campusType={campusType}
            nonTelkomSurcharge={settings.non_telkom_surcharge}
            onChangeCampusType={setCampusType}
            onOpenMatcher={() => setMatcherOpen(true)}
            onSelectChapterFromHero={jumpToChapter}
          />

          <ThesisFlowDiagram onJumpToChapter={jumpToChapter} />

          <PackageCatalog
            categories={categories}
            activeCategoryId={activeCategoryId}
            campusType={campusType}
            nonTelkomSurcharge={settings.non_telkom_surcharge}
            addonSessionPrice={settings.addon_session_price}
            highlightedPackageId={highlightedPackageId}
            onChangeCampusType={setCampusType}
            onSelectCategory={(id) => {
              setActiveCategoryId(id);
              setHighlightedPackageId(null);
            }}
            onSelectPackage={(pkg, category) => setSelectedOrder({ pkg, category })}
            onOpenMatcher={() => setMatcherOpen(true)}
          />

          <ChapterShowcase onJumpToChapter={jumpToChapter} />

          <HowItWorks />
          <FaqSection nonTelkomSurcharge={settings.non_telkom_surcharge} />
        </main>

        <Footer brandName={settings.brand_name} />

        <QuickMatcherModal
          open={matcherOpen}
          categories={categories}
          onClose={() => setMatcherOpen(false)}
          onRecommend={handleRecommend}
        />

        <OrderDrawer
          selected={selectedOrder}
          initialCampusType={campusType}
          settings={settings}
          onClose={() => setSelectedOrder(null)}
        />
      </div>
    </MotionConfig>
  );
}
