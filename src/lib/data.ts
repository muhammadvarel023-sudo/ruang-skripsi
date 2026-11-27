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
  return {
    brand_name: map.brand_name || "RuangSkripsi",
    admin_telegram: map.admin_telegram ?? "ruangskripsi",
    admin_line: map.admin_line ?? "ruangskripsi",
    non_telkom_surcharge: Number.isNaN(parsedSurcharge) ? 50000 : parsedSurcharge,
    wa_template:
      map.wa_template ||
      "Halo Admin RuangSkripsi, saya ingin konfirmasi permintaan konsultasi:\nKode: {{orderCode}}\nNama: {{studentName}}\nKampus: {{campusName}}\nPaket: {{packageName}}\nEstimasi: {{price}}",
  };
}
