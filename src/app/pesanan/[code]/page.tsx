import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/data";
import {
  buildContactMessage,
  buildLineUrl,
  buildTelegramUrl,
  formatRupiah,
  ORDER_STATUS_META,
} from "@/lib/format";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  MessageCircle,
  Send,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrderSummaryPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const [order, settings] = await Promise.all([
    prisma.order.findUnique({ where: { orderCode: code } }),
    getSiteSettings(),
  ]);

  if (!order) {
    notFound();
  }

  const statusMeta =
    ORDER_STATUS_META[order.status] ?? ORDER_STATUS_META.PENDING;

  const message = buildContactMessage(settings.wa_template, {
    orderCode: order.orderCode,
    studentName: order.studentName,
    campusName: order.campusName,
    major: order.major,
    categoryName: order.categoryNameSnapshot,
    packageName: order.packageNameSnapshot,
    price: order.priceSnapshot,
    researchType: order.researchType,
    topicOrTitle: order.topicOrTitle,
  });

  const telegramUrl = settings.admin_telegram.trim()
    ? buildTelegramUrl(settings.admin_telegram, message)
    : null;
  const lineUrl = settings.admin_line.trim()
    ? buildLineUrl(settings.admin_line)
    : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-12 sm:px-6 paper-grid">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#090E1A]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke {settings.brand_name}
          </Link>
          <span className="flex items-center gap-1.5 text-xs font-bold text-[#090E1A]">
            <BookOpen className="h-3.5 w-3.5 text-[#2563EB]" />
            {settings.brand_name}
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border-2 border-[#090E1A] bg-white shadow-lg">
          <div className="border-b border-slate-100 bg-[#090E1A] px-6 py-6 text-center text-white">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#10B981] text-white">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="mt-3 font-mono text-xs font-bold tracking-wider text-blue-300">
              KODE PESANAN
            </p>
            <h1 className="mt-1 font-mono text-2xl font-bold text-white">
              {order.orderCode}
            </h1>
            <div className="mt-3 flex justify-center">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${statusMeta.bg} ${statusMeta.text}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dot}`} />
                {statusMeta.label}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-4 text-sm">
            <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
              <p className="font-mono text-[11px] font-bold text-[#2563EB]">
                {order.categoryNameSnapshot}
              </p>
              <div className="mt-1 flex items-baseline justify-between gap-4">
                <p className="text-base font-bold text-[#090E1A]">
                  {order.packageNameSnapshot}
                </p>
                <p className="font-mono text-base font-bold text-[#090E1A] tabular-nums">
                  {formatRupiah(order.priceSnapshot)}
                </p>
              </div>
            </div>

            <dl className="space-y-2.5 text-xs">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Nama Mahasiswa</dt>
                <dd className="font-bold text-[#090E1A]">{order.studentName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Asal Kampus</dt>
                <dd className="font-semibold text-[#2563EB]">{order.campusName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Program Studi</dt>
                <dd className="font-medium text-[#090E1A]">{order.major}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Telegram / LINE</dt>
                <dd className="font-mono text-[#090E1A]">{order.whatsapp}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Pendekatan Kualitatif</dt>
                <dd className="font-medium text-[#090E1A]">{order.researchType}</dd>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <dt className="text-slate-500">Topik / Judul</dt>
                <dd className="mt-1 rounded-lg bg-[#F8FAFC] p-3 font-medium text-slate-800">
                  {order.topicOrTitle}
                </dd>
              </div>
              {order.notes && (
                <div>
                  <dt className="text-slate-500">Catatan Tambahan</dt>
                  <dd className="mt-1 rounded-lg bg-[#F8FAFC] p-3 text-slate-700">
                    {order.notes}
                  </dd>
                </div>
              )}
            </dl>

            <div className="space-y-2.5 pt-4">
              {telegramUrl && (
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0284C7] px-5 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#0369A1]"
                >
                  <Send className="h-4 w-4" />
                  Konfirmasi via Telegram
                </a>
              )}
              {lineUrl && (
                <a
                  href={lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#06C755] px-5 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#05B34C]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Konfirmasi via LINE ({settings.admin_line})
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
