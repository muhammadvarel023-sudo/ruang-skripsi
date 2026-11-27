import { getPublicCatalog, getSiteSettings } from "@/lib/data";
import { HomeClient } from "@/components/public/HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, settings] = await Promise.all([
    getPublicCatalog(),
    getSiteSettings(),
  ]);

  return <HomeClient categories={categories} settings={settings} />;
}
