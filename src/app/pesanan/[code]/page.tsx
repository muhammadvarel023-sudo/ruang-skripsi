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
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-2 transition-colors duration-200 hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Kembali ke {settings.brand_name}
          </Link>
          <span className="flex items-center gap-2 font-display text-base text-ink">
            <BrandLogo size={26} />
            {settings.brand_name}
          </span>
        </div>

        <div className="well-solstice overflow-hidden">
          <div className="band-ink border-b border-paper/15 px-6 py-7 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold text-ink">
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="mt-3 text-xs font-semibold text-gold-2">
              Invoice &amp; Kode Pesanan
            </p>
            <h1 className="num mx-auto mt-1 font-display text-2xl text-paper">
              {order.orderCode}
            </h1>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-paper/25 bg-paper/10 px-3 py-1 text-xs font-semibold text-paper">
                Pembayaran: {payMeta.label}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-paper/25 bg-paper/10 px-3 py-1 text-xs font-semibold text-gold-2">
                {statusMeta.label}
              </span>
            </div>
          </div>

          <div className="space-y-5 p-6 text-sm">
            <div className="border-l-2 border-accent bg-paper p-4">
              <p className="text-xs font-semibold text-accent">
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
                <span className="num font-semibold text-accent">
                  Tagihan Awal: {formatRupiah(amountDueNow)}
                </span>
              </div>
            </div>

            {order.paymentStatus !== "PAID" && (
              <div className="space-y-3 border border-rule bg-paper p-4">
                <p className="text-xs font-semibold text-ink">
                  Instruksi Pembayaran
                </p>

                {settings.qris_image_url && (
                  <div className="border-b border-rule pb-3 text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={settings.qris_image_url}
                      alt="QRIS TelisikRiset"
                      width={224}
                      height={224}
                      className="mx-auto max-h-56 border border-rule bg-paper-2 p-1.5 object-contain"
                    />
                    {settings.qris_merchant_name && (
                      <p className="mt-2 text-xs font-semibold text-ink">
                        QRIS resmi a.n.{" "}
                        <span className="text-accent">
                          {settings.qris_merchant_name}
                        </span>
                      </p>
                    )}
                  </div>
                )}

                {settings.bank_account_number && (
                  <div className="space-y-1.5 bg-paper-2 p-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted">Bank / E-Wallet</span>
                      <span className="font-semibold text-ink">
                        {settings.bank_name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">No. Rekening</span>
                      <span className="num font-semibold text-ink">
                        {settings.bank_account_number}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Atas Nama</span>
                      <span className="font-semibold text-ink">
                        {settings.bank_account_holder}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <dl className="divide-y divide-rule border-y border-rule text-xs">
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-muted">Nama Mahasiswa</dt>
                <dd className="font-semibold text-ink">{order.studentName}</dd>
              </div>
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-muted">Asal Kampus</dt>
                <dd className="font-semibold text-accent">{order.campusName}</dd>
              </div>
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-muted">Program Studi</dt>
                <dd className="font-medium text-ink">{order.major}</dd>
              </div>
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-muted">Telegram / LINE</dt>
                <dd className="font-medium text-ink">{order.whatsapp}</dd>
              </div>
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-muted">Pendekatan Kualitatif</dt>
                <dd className="font-medium text-ink">{order.researchType}</dd>
              </div>
              <div className="py-3">
                <dt className="text-muted">Topik / Judul</dt>
                <dd className="mt-1.5 bg-paper p-3 font-medium text-ink">
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
                  Konfirmasi &amp; Kirim Bukti via Telegram
                </a>
              )}
              {lineUrl && (
                <a
                  href={lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-quiet w-full justify-center"
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
