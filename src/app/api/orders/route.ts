import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { generateOrderCode } from "@/lib/format";
import { getSiteSettings } from "@/lib/data";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      packageId,
      campusType,
      campusName,
      studentName,
      major,
      whatsapp,
      researchType,
      topicOrTitle,
      notes,
    } = body;

    if (
      !packageId ||
      !studentName?.trim() ||
      !major?.trim() ||
      !whatsapp?.trim() ||
      !topicOrTitle?.trim()
    ) {
      return NextResponse.json(
        { error: "Mohon lengkapi semua kolom wajib pada formulir." },
        { status: 400 }
      );
    }

    const normalizedCampusType =
      campusType === "NON_TELKOM" ? "NON_TELKOM" : "TELKOM_FKS";
    const resolvedCampusName =
      normalizedCampusType === "TELKOM_FKS"
        ? "Telkom University (FKS)"
        : String(campusName || "").trim() || "Di Luar Telkom University";

    const [pkg, settings] = await Promise.all([
      prisma.package.findUnique({
        where: { id: String(packageId) },
        include: { category: true },
      }),
      getSiteSettings(),
    ]);

    if (!pkg || !pkg.isActive) {
      return NextResponse.json(
        { error: "Paket layanan tidak ditemukan atau sedang tidak aktif." },
        { status: 404 }
      );
    }

    const basePrice =
      pkg.discountPrice && pkg.discountPrice > 0 ? pkg.discountPrice : pkg.price;
    const surcharge =
      normalizedCampusType === "NON_TELKOM" ? settings.non_telkom_surcharge : 0;
    const finalPrice = basePrice + surcharge;

    let orderCode = generateOrderCode();
    const existing = await prisma.order.findUnique({ where: { orderCode } });
    if (existing) {
      orderCode = generateOrderCode();
    }

    const order = await prisma.order.create({
      data: {
        orderCode,
        packageId: pkg.id,
        categoryNameSnapshot: pkg.category.name,
        packageNameSnapshot: pkg.name,
        priceSnapshot: finalPrice,
        campusType: normalizedCampusType,
        campusName: resolvedCampusName,
        studentName: String(studentName).trim(),
        major: String(major).trim(),
        whatsapp: String(whatsapp).trim(),
        researchType: String(researchType || "Belum Yakin (Butuh Diskusi)").trim(),
        topicOrTitle: String(topicOrTitle).trim(),
        notes: notes ? String(notes).trim() : null,
        status: "PENDING",
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error("POST /api/orders error:", err);
    return NextResponse.json(
      { error: "Gagal menyimpan permintaan layanan. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
