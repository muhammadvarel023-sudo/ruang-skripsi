import { getSiteSettings } from "@/lib/data";
import { SettingsClient } from "@/components/admin/SettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();
  return <SettingsClient initialSettings={settings} />;
}
