import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { getSiteSettings } from "@/lib/data";
import { ORDER_STATUS_META, PAYMENT_STATUS_META } from "@/lib/format";

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

    // Sync status changes to Google Sheets webhook in real-time
    const settings = await getSiteSettings();
    if (settings.google_sheet_webhook_url?.startsWith("http")) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4500);
        await fetch(settings.google_sheet_webhook_url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            action: "update",
            orderCode: updated.orderCode,
            paymentStatus:
              PAYMENT_STATUS_META[updated.paymentStatus]?.label ??
              updated.paymentStatus,
            orderStatus:
              ORDER_STATUS_META[updated.status]?.label ?? updated.status,
          }),
        });
        clearTimeout(timeout);
      } catch (sheetErr) {
        console.warn("Google Sheets status sync skipped/failed:", sheetErr);
      }
    }

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
