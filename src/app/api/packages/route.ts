import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/format";

export async function GET() {
  const packages = await prisma.package.findMany({
    orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
    include: { category: true },
  });
  return NextResponse.json({ packages });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const categoryId = String(body.categoryId || "");
    const name = String(body.name || "").trim();
    const shortDescription = String(body.shortDescription || "").trim();
    const studentCondition = String(body.studentCondition || "").trim();
    const price = Number(body.price);
    const discountPrice =
      body.discountPrice !== null && body.discountPrice !== undefined && body.discountPrice !== ""
        ? Number(body.discountPrice)
        : null;
    const outputsArray: string[] = Array.isArray(body.outputs)
      ? body.outputs.map((o: unknown) => String(o).trim()).filter(Boolean)
      : [];

    if (!categoryId || !name || !shortDescription || !studentCondition || Number.isNaN(price) || price < 0) {
      return NextResponse.json(
        { error: "Mohon lengkapi nama paket, kategori, deskripsi, kondisi awal, dan harga yang valid." },
        { status: 400 }
      );
    }

    const existingCount = await prisma.package.count({ where: { categoryId } });
    const slug = `${slugify(name)}-${Date.now().toString(36).slice(-4)}`;

    const pkg = await prisma.package.create({
      data: {
        categoryId,
        name,
        slug,
        badge: body.badge ? String(body.badge).trim() : null,
        shortDescription,
        studentCondition,
        outputs: JSON.stringify(outputsArray),
        price,
        discountPrice,
        durationLabel: body.durationLabel ? String(body.durationLabel).trim() : null,
        isFeatured: Boolean(body.isFeatured),
        isActive: body.isActive !== false,
        sortOrder: existingCount + 1,
      },
    });

    return NextResponse.json({ package: pkg }, { status: 201 });
  } catch (err) {
    console.error("POST /api/packages error:", err);
    return NextResponse.json({ error: "Gagal menambah paket layanan." }, { status: 500 });
  }
}
