import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();

    const data: Record<string, unknown> = {};
    if (body.categoryId !== undefined) data.categoryId = String(body.categoryId);
    if (body.name !== undefined) data.name = String(body.name).trim();
    if (body.badge !== undefined) data.badge = body.badge ? String(body.badge).trim() : null;
    if (body.shortDescription !== undefined) data.shortDescription = String(body.shortDescription).trim();
    if (body.studentCondition !== undefined) data.studentCondition = String(body.studentCondition).trim();
    if (body.outputs !== undefined && Array.isArray(body.outputs)) {
      data.outputs = JSON.stringify(
        body.outputs.map((o: unknown) => String(o).trim()).filter(Boolean)
      );
    }
    if (body.price !== undefined) data.price = Number(body.price);
    if (body.discountPrice !== undefined) {
      data.discountPrice =
        body.discountPrice === null || body.discountPrice === ""
          ? null
          : Number(body.discountPrice);
    }
    if (body.durationLabel !== undefined) {
      data.durationLabel = body.durationLabel ? String(body.durationLabel).trim() : null;
    }
    if (body.isFeatured !== undefined) data.isFeatured = Boolean(body.isFeatured);
    if (body.isActive !== undefined) data.isActive = Boolean(body.isActive);
    if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder);

    const updated = await prisma.package.update({
      where: { id },
      data,
    });

    return NextResponse.json({ package: updated });
  } catch {
    return NextResponse.json({ error: "Paket tidak ditemukan." }, { status: 404 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await prisma.package.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Paket tidak ditemukan." }, { status: 404 });
  }
}
