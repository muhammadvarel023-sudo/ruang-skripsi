import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/format";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      packages: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const shortLabel = String(body.shortLabel || name).trim();
    const description = String(body.description || "").trim();

    if (!name) {
      return NextResponse.json({ error: "Nama kategori wajib diisi." }, { status: 400 });
    }

    const count = await prisma.category.count();
    const slug = `${slugify(name)}-${Date.now().toString(36).slice(-4)}`;

    const category = await prisma.category.create({
      data: {
        name,
        shortLabel,
        slug,
        description,
        sortOrder: count + 1,
        isActive: body.isActive !== false,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gagal menambah kategori." }, { status: 500 });
  }
}
