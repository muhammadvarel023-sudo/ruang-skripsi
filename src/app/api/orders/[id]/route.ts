import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const VALID_STATUSES = [
  "PENDING",
  "WAITING_CONFIRMATION",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

const VALID_PAYMENT_STATUSES = ["UNPAID", "DP_PAID", "PAID"];

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

    const data: Record<string, string> = {};
    if (body.status !== undefined) {
      const status = String(body.status);
      if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json({ error: "Status pesanan tidak valid." }, { status: 400 });
      }
      data.status = status;
    }

    if (body.paymentStatus !== undefined) {
      const paymentStatus = String(body.paymentStatus);
      if (!VALID_PAYMENT_STATUSES.includes(paymentStatus)) {
        return NextResponse.json(
          { error: "Status pembayaran tidak valid." },
          { status: 400 }
        );
      }
      data.paymentStatus = paymentStatus;
    }

    const updated = await prisma.order.update({
      where: { id },
      data,
    });

    return NextResponse.json({ order: updated });
  } catch {
    return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
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
    await prisma.order.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
  }
}
