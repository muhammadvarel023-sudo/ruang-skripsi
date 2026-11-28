import { prisma } from "@/lib/prisma";
import { parseOutputs } from "@/lib/format";
import type { CategoryDTO, SiteSettings } from "@/lib/types";

export async function getPublicCatalog(): Promise<CategoryDTO[]> {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      packages: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    shortLabel: cat.shortLabel,
    slug: cat.slug,
    description: cat.description,
    sortOrder: cat.sortOrder,
    isActive: cat.isActive,
    packages: cat.packages.map((pkg) => ({
      id: pkg.id,
      categoryId: pkg.categoryId,
      name: pkg.name,
      slug: pkg.slug,
      badge: pkg.badge,
      shortDescription: pkg.shortDescription,
      studentCondition: pkg.studentCondition,
      outputs: parseOutputs(pkg.outputs),
      price: pkg.price,
      discountPrice: pkg.discountPrice,
      durationLabel: pkg.durationLabel,
      isFeatured: pkg.isFeatured,
      isActive: pkg.isActive,
      sortOrder: pkg.sortOrder,
    })),
  }));
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const rows = await prisma.setting.findMany();
  const map: Record<string, string> = {};
  for (const r of rows) {
    map[r.key] = r.value;
  }
  const parsedSurcharge = Number(map.non_telkom_surcharge);
  const parsedAddon = Number(map.addon_session_price);
  return {
    brand_name: map.brand_name || "TelisikRiset",
    admin_telegram: map.admin_telegram ?? "telisikriset",
    admin_line: map.admin_line ?? "telisikriset",
    non_telkom_surcharge: Number.isNaN(parsedSurcharge) ? 50000 : parsedSurcharge,
    addon_session_price: Number.isNaN(parsedAddon) ? 60000 : parsedAddon,
    qris_image_url: map.qris_image_url || "",
    qris_merchant_name: map.qris_merchant_name || "",
    bank_name: map.bank_name || "",
    bank_account_number: map.bank_account_number || "",
    bank_account_holder: map.bank_account_holder || "",
    google_sheet_webhook_url: map.google_sheet_webhook_url || "",
    wa_template:
      map.wa_template ||
      "Halo Admin TelisikRiset, saya ingin konfirmasi & kirim bukti pembayaran:\nKode: {{orderCode}}\nNama: {{studentName}}\nKampus: {{campusName}}\nPaket: {{packageName}}\nSkema Bayar: {{paymentPlan}} ({{amountDueNow}})",
  };
}
