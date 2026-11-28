import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/data";
import {
  buildContactMessage,
  buildLineUrl,
  buildTelegramUrl,
  formatPaymentPlanLabel,
  formatRupiah,
  ORDER_STATUS_META,
  PAYMENT_STATUS_META,
} from "@/lib/format";
import {
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  Send,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

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
  const payMeta =
    PAYMENT_STATUS_META[order.paymentStatus] ?? PAYMENT_STATUS_META.UNPAID;

  const amountDueNow =
    order.amountDueNow > 0 ? order.amountDueNow : order.priceSnapshot;

  const message = buildContactMessage(settings.wa_template, {
    orderCode: order.orderCode,
    studentName: order.studentName,
    campusName: order.campusName,
    major: order.major,
    categoryName: order.categoryNameSnapshot,
    packageName: order.packageNameSnapshot,
    price: order.priceSnapshot,
    paymentPlan: order.paymentPlan,
    amountDueNow,
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
    <div className="min-h-screen bg-paper px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-2 transition-colors duration-200 hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Kembali ke {settings.brand_name}
          </Link>
          <span className="flex items-center gap-2 font-display text-base text-ink">
            <BrandLogo size={26} />
            {settings.brand_name}
          </span>
        </div>

        <div className="surface-card overflow-hidden">
          <div className="bg-paper-3 px-6 py-7 text-center text-ink">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-ink">
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="mt-3 text-xs font-bold text-accent">
              Invoice &amp; Kode Pesanan
            </p>
            <h1 className="num mx-auto mt-1 font-display text-2xl text-ink">
              {order.orderCode}
            </h1>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-paper-2 px-3 py-1 text-xs font-bold text-ink">
                Pembayaran: {payMeta.label}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-ink">
                {statusMeta.label}
              </span>
            </div>
          </div>

          <div className="space-y-5 p-6 text-sm">
            <div className="rounded-2xl bg-paper p-4 text-ink">
              <p className="text-xs font-bold text-accent">
                {order.categoryNameSnapshot}
              </p>
              <div className="mt-1 flex items-baseline justify-between gap-4">
                <p className="font-display text-lg text-ink">
                  {order.packageNameSnapshot}
                </p>
                <p className="num font-display text-lg text-ink">
                  {formatRupiah(order.priceSnapshot)}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-rule pt-3 text-xs">
                <span className="font-medium text-ink-2">
                  {formatPaymentPlanLabel(order.paymentPlan)}
                </span>
                <span className="num font-bold text-accent">
                  Tagihan Awal: {formatRupiah(amountDueNow)}
                </span>
              </div>
            </div>

            {order.paymentStatus !== "PAID" && (
              <div className="space-y-3 rounded-2xl border border-[var(--color-card-rule)] bg-white p-4">
                <p className="text-xs font-bold text-card-ink">
                  Instruksi Pembayaran
                </p>

                {settings.qris_image_url && (
                  <div className="border-b border-[var(--color-card-rule)] pb-3 text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={settings.qris_image_url}
                      alt="QRIS TelisikRiset"
                      width={224}
                      height={224}
                      className="mx-auto max-h-56 rounded-xl border border-[var(--color-card-rule)] bg-white p-1.5 object-contain"
                    />
                    {settings.qris_merchant_name && (
                      <p className="mt-2 text-xs font-bold text-card-ink">
                        QRIS resmi a.n.{" "}
                        <span className="text-paper">
                          {settings.qris_merchant_name}
                        </span>
                      </p>
                    )}
                  </div>
                )}

                {settings.bank_account_number && (
                  <div className="space-y-1.5 rounded-xl bg-card p-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[var(--color-card-muted)]">Bank / E-Wallet</span>
                      <span className="font-bold text-card-ink">
                        {settings.bank_name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-card-muted)]">No. Rekening</span>
                      <span className="num font-bold text-card-ink">
                        {settings.bank_account_number}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-card-muted)]">Atas Nama</span>
                      <span className="font-bold text-card-ink">
                        {settings.bank_account_holder}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <dl className="divide-y divide-[var(--color-card-rule)] border-y border-[var(--color-card-rule)] text-xs">
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-[var(--color-card-muted)]">Nama Mahasiswa</dt>
                <dd className="font-bold text-card-ink">{order.studentName}</dd>
              </div>
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-[var(--color-card-muted)]">Asal Kampus</dt>
                <dd className="font-bold text-paper">{order.campusName}</dd>
              </div>
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-[var(--color-card-muted)]">Program Studi</dt>
                <dd className="font-medium text-card-ink">{order.major}</dd>
              </div>
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-[var(--color-card-muted)]">Telegram / LINE</dt>
                <dd className="font-medium text-card-ink">{order.whatsapp}</dd>
              </div>
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-[var(--color-card-muted)]">Pendekatan Kualitatif</dt>
                <dd className="font-medium text-card-ink">{order.researchType}</dd>
              </div>
              <div className="py-3">
                <dt className="text-[var(--color-card-muted)]">Topik / Judul</dt>
                <dd className="mt-1.5 rounded-xl bg-white p-3 font-medium text-card-ink">
                  {order.topicOrTitle}
                </dd>
              </div>
            </dl>

            <div className="space-y-2.5 pt-2">
              {telegramUrl && (
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full justify-center"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Konfirmasi via Telegram
                </a>
              )}
              {lineUrl && (
                <a
                  href={lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-dark-ink w-full justify-center"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
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
