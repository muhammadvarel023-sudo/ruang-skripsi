import { prisma } from "@/lib/prisma";
import { parseOutputs } from "@/lib/format";
import { ServicesClient } from "@/components/admin/ServicesClient";
import type { CategoryDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const rows = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      packages: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  const categories: CategoryDTO[] = rows.map((cat) => ({
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

  return <ServicesClient initialCategories={categories} />;
}
