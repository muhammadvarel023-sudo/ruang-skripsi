"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowRight,
  CheckCircle2,
  Send,
  MessageCircle,
  Loader2,
  Copy,
  Check,
  ExternalLink,
  GraduationCap,
  Building2,
  QrCode,
  Landmark,
  Wallet,
} from "lucide-react";
import type {
  CampusType,
  CategoryDTO,
  OrderDTO,
  PackageDTO,
  PaymentPlan,
  SiteSettings,
} from "@/lib/types";
import {
  buildContactMessage,
  buildLineUrl,
  buildTelegramUrl,
  formatPaymentPlanLabel,
  formatRupiah,
} from "@/lib/format";
import { APPLE_EASE, APPLE_SPRING } from "@/lib/motion";

interface OrderDrawerProps {
  selected: { pkg: PackageDTO; category: CategoryDTO } | null;
  initialCampusType: CampusType;
  settings: SiteSettings;
  onClose: () => void;
}

const BANDUNG_PRIVATE_CAMPUSES = [
  "Universitas Islam Bandung (UNISBA)",
  "Universitas Pasundan (UNPAS)",
  "Universitas Komputer Indonesia (UNIKOM)",
  "Universitas Widyatama (UTama)",
  "Universitas Katolik Parahyangan (UNPAR)",
  "Universitas Kristen Maranatha",
  "Universitas Sangga Buana (USB YPKP)",
  "Universitas ARS Bandung",
  "Universitas Muhammadiyah Bandung (UM Bandung)",
  "Universitas Bale Bandung (UNIBBA)",
];

const QUALITATIVE_APPROACHES = [
  "Studi Kasus",
  "Fenomenologi",
  "Analisis Wacana / Framing",
  "Semiotika",
  "Etnografi / Netnografi",
  "Deskriptif Kualitatif",
  "Belum Yakin (Butuh Diskusi)",
];

export function OrderDrawer({
  selected,
  initialCampusType,
  settings,
  onClose,
}: OrderDrawerProps) {
  const [campusType, setCampusType] = useState<CampusType>(initialCampusType);
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan>("DP_50");
  const [campusName, setCampusName] = useState(BANDUNG_PRIVATE_CAMPUSES[0]);
  const [studentName, setStudentName] = useState("");
  const [major, setMajor] = useState("");
  const [contactHandle, setContactHandle] = useState("");
  const [researchType, setResearchType] = useState(QUALITATIVE_APPROACHES[0]);
  const [topicOrTitle, setTopicOrTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<OrderDTO | null>(null);
  const [payMethodTab, setPayMethodTab] = useState<"QRIS" | "TRANSFER">("QRIS");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (selected) {
      setCampusType(initialCampusType);
      setPaymentPlan("DP_50");
      setAgreedTerms(false);
      setError(null);
      setCreatedOrder(null);
      setCopiedKey(null);
      setPayMethodTab(settings.qris_image_url ? "QRIS" : "TRANSFER");
    }
  }, [selected, initialCampusType, settings.qris_image_url]);

  const basePrice = selected
    ? selected.pkg.discountPrice && selected.pkg.discountPrice < selected.pkg.price
      ? selected.pkg.discountPrice
      : selected.pkg.price
    : 0;
  const surcharge =
    campusType === "NON_TELKOM" ? settings.non_telkom_surcharge : 0;
  const totalPrice = basePrice + surcharge;
  const dueNow =
    paymentPlan === "DP_50" ? Math.ceil(totalPrice / 2) : totalPrice;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;

    if (campusType === "NON_TELKOM" && !campusName.trim()) {
      setError("Mohon tulis nama universitas asalmu.");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: selected.pkg.id,
          campusType,
          campusName:
            campusType === "TELKOM_FKS"
              ? "Telkom University (FKS)"
              : campusName.trim(),
          paymentPlan,
          studentName,
          major,
          whatsapp: contactHandle,
          researchType,
          topicOrTitle,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Terjadi kesalahan saat mengirim permintaan.");
        return;
      }
      setCreatedOrder(data.order);
    } catch {
      setError("Koneksi bermasalah. Silakan coba beberapa saat lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  const formattedMessage = createdOrder
    ? buildContactMessage(settings.wa_template, {
        orderCode: createdOrder.orderCode,
        studentName: createdOrder.studentName,
        campusName: createdOrder.campusName,
        major: createdOrder.major,
        categoryName: createdOrder.categoryNameSnapshot,
        packageName: createdOrder.packageNameSnapshot,
        price: createdOrder.priceSnapshot,
        paymentPlan: createdOrder.paymentPlan,
        amountDueNow: createdOrder.amountDueNow,
        researchType: createdOrder.researchType,
        topicOrTitle: createdOrder.topicOrTitle,
      })
    : "";

  const telegramUrl =
    createdOrder && settings.admin_telegram.trim()
      ? buildTelegramUrl(settings.admin_telegram, formattedMessage)
      : null;

  const lineUrl =
    createdOrder && settings.admin_line.trim()
      ? buildLineUrl(settings.admin_line)
      : null;

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  return (
    <AnimatePresence>
      {selected && (
        <div className="fixed inset-0 z-[400] flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: APPLE_EASE }}
            onClick={onClose}
            className="fixed inset-0 bg-black/55"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-package-title"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={APPLE_SPRING}
            className="relative z-10 flex h-full w-full max-w-lg flex-col bg-card text-card-ink shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-paper-3 px-6 py-4 text-ink">
              <div>
                <p className="text-xs font-bold text-accent">
                  {createdOrder
                    ? "Langkah 2 dari 2: Pembayaran & Konfirmasi"
                    : "Langkah 1 dari 2: Biodata & Skema Bayar"}
                </p>
                <h3 id="drawer-package-title" className="mt-0.5 font-display text-lg text-ink">
                  {selected.pkg.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-paper-2 text-ink transition-colors duration-200 hover:bg-accent hover:text-accent-ink active:translate-y-px cursor-pointer"
                aria-label="Tutup panel"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <AnimatePresence mode="wait">
                {!createdOrder ? (
                  <motion.form
                    key="order-form"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.24, ease: APPLE_EASE }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    {/* Package & Total Box */}
                    <div className="rounded-2xl bg-paper p-4 text-ink">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold text-accent">
                            {selected.category.name}
                          </span>
                          <p className="mt-0.5 font-display text-base text-ink">
                            {selected.pkg.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="num font-display text-xl text-ink">
                            {formatRupiah(totalPrice)}
                          </span>
                          {campusType === "NON_TELKOM" && (
                            <p className="num text-xs font-bold text-accent">
                              Dasar {formatRupiah(basePrice)} + {formatRupiah(surcharge)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Campus selector */}
                    <div>
                      <span className="mb-1.5 block text-xs font-bold text-card-ink">
                        Asal Kampus <span className="text-error">*</span>
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setCampusType("TELKOM_FKS")}
                          className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-2xl border-2 px-3 py-2 text-xs font-bold transition-colors duration-200 active:translate-y-px cursor-pointer ${
                            campusType === "TELKOM_FKS"
                              ? "border-paper bg-paper text-ink"
                              : "border-[var(--color-card-rule)] bg-white text-card-ink hover:border-paper"
                          }`}
                        >
                          <GraduationCap className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          <span className="whitespace-nowrap">Telkom Univ (FKS)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCampusType("NON_TELKOM")}
                          className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-2xl border-2 px-3 py-2 text-xs font-bold transition-colors duration-200 active:translate-y-px cursor-pointer ${
                            campusType === "NON_TELKOM"
                              ? "border-accent bg-accent text-accent-ink"
                              : "border-[var(--color-card-rule)] bg-white text-card-ink hover:border-paper"
                          }`}
                        >
                          <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          <span className="whitespace-nowrap">
                            PTS Bandung (+{formatRupiah(settings.non_telkom_surcharge)})
                          </span>
                        </button>
                      </div>
                    </div>

                    {campusType === "NON_TELKOM" && (
                      <div>
                        <label
                          htmlFor="order-campus-name"
                          className="mb-1.5 block text-xs font-bold text-card-ink"
                        >
                          Kampus Swasta Bandung <span className="text-error">*</span>
                        </label>
                        <select
                          id="order-campus-name"
                          required
                          value={campusName}
                          onChange={(e) => setCampusName(e.target.value)}
                          className="min-h-[46px] w-full rounded-2xl border border-[var(--color-card-rule)] bg-white px-3.5 text-sm text-card-ink focus-visible:outline-2 focus-visible:outline-paper"
                        >
                          {BANDUNG_PRIVATE_CAMPUSES.map((campus) => (
                            <option key={campus} value={campus}>
                              {campus}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Payment Plan Selector */}
                    <div>
                      <span className="mb-1.5 block text-xs font-bold text-card-ink">
                        Skema Pembayaran <span className="text-error">*</span>
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPaymentPlan("DP_50")}
                          className={`whitespace-nowrap rounded-2xl border-2 p-3 text-left transition-colors duration-200 active:translate-y-px cursor-pointer ${
                            paymentPlan === "DP_50"
                              ? "border-paper bg-paper text-ink"
                              : "border-[var(--color-card-rule)] bg-white text-card-ink hover:border-paper/60"
                          }`}
                        >
                          <span className="flex items-center justify-between">
                            <span className="text-xs font-bold">DP 50% Dulu</span>
                            <Wallet className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                          </span>
                          <span className="num mt-1 block font-display text-lg">
                            {formatRupiah(Math.ceil(totalPrice / 2))}
                          </span>
                          <span className="mt-0.5 block text-xs opacity-75">
                            Lock jadwal sesi 1
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentPlan("FULL")}
                          className={`whitespace-nowrap rounded-2xl border-2 p-3 text-left transition-colors duration-200 active:translate-y-px cursor-pointer ${
                            paymentPlan === "FULL"
                              ? "border-paper bg-paper text-ink"
                              : "border-[var(--color-card-rule)] bg-white text-card-ink hover:border-paper/60"
                          }`}
                        >
                          <span className="flex items-center justify-between">
                            <span className="text-xs font-bold">Bayar Lunas</span>
                            <CheckCircle2 className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                          </span>
                          <span className="num mt-1 block font-display text-lg">
                            {formatRupiah(totalPrice)}
                          </span>
                          <span className="mt-0.5 block text-xs opacity-75">
                            Sekali bayar beres
                          </span>
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div
                        role="alert"
                        className="rounded-2xl border border-error bg-error/10 px-4 py-3 text-xs font-bold text-error"
                      >
                        {error}
                      </div>
                    )}

                    <div className="grid gap-3.5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="order-student-name"
                          className="mb-1.5 block text-xs font-bold text-card-ink"
                        >
                          Nama Lengkap <span className="text-error">*</span>
                        </label>
                        <input
                          id="order-student-name"
                          type="text"
                          required
                          autoComplete="name"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="Contoh: Nadia Kartika"
                          className="min-h-[46px] w-full rounded-2xl border border-[var(--color-card-rule)] bg-white px-3.5 text-sm text-card-ink placeholder:text-[var(--color-card-muted)] focus-visible:outline-2 focus-visible:outline-paper"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="order-major"
                          className="mb-1.5 block text-xs font-bold text-card-ink"
                        >
                          Prodi / Konsentrasi <span className="text-error">*</span>
                        </label>
                        <input
                          id="order-major"
                          type="text"
                          required
                          value={major}
                          onChange={(e) => setMajor(e.target.value)}
                          placeholder="Cth: Ilmu Komunikasi / PR"
                          className="min-h-[46px] w-full rounded-2xl border border-[var(--color-card-rule)] bg-white px-3.5 text-sm text-card-ink placeholder:text-[var(--color-card-muted)] focus-visible:outline-2 focus-visible:outline-paper"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3.5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="order-contact"
                          className="mb-1.5 block text-xs font-bold text-card-ink"
                        >
                          Telegram / ID LINE <span className="text-error">*</span>
                        </label>
                        <input
                          id="order-contact"
                          type="text"
                          required
                          value={contactHandle}
                          onChange={(e) => setContactHandle(e.target.value)}
                          placeholder="Cth: @nadiakartika"
                          className="min-h-[46px] w-full rounded-2xl border border-[var(--color-card-rule)] bg-white px-3.5 text-sm text-card-ink placeholder:text-[var(--color-card-muted)] focus-visible:outline-2 focus-visible:outline-paper"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="order-research-type"
                          className="mb-1.5 block text-xs font-bold text-card-ink"
                        >
                          Pendekatan Kualitatif
                        </label>
                        <select
                          id="order-research-type"
                          value={researchType}
                          onChange={(e) => setResearchType(e.target.value)}
                          className="min-h-[46px] w-full rounded-2xl border border-[var(--color-card-rule)] bg-white px-3.5 text-sm text-card-ink focus-visible:outline-2 focus-visible:outline-paper"
                        >
                          {QUALITATIVE_APPROACHES.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="order-topic"
                        className="mb-1.5 block text-xs font-bold text-card-ink"
                      >
                        Topik / Rancangan Judul <span className="text-error">*</span>
                      </label>
                      <input
                        id="order-topic"
                        type="text"
                        required
                        value={topicOrTitle}
                        onChange={(e) => setTopicOrTitle(e.target.value)}
                        placeholder="Tulis fenomena atau judul sementaramu"
                        className="min-h-[46px] w-full rounded-2xl border border-[var(--color-card-rule)] bg-white px-3.5 text-sm text-card-ink placeholder:text-[var(--color-card-muted)] focus-visible:outline-2 focus-visible:outline-paper"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="order-notes"
                        className="mb-1.5 block text-xs font-bold text-card-ink"
                      >
                        Catatan Tambahan (Opsional)
                      </label>
                      <textarea
                        id="order-notes"
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Progres atau revisi singkat dari dosen…"
                        className="w-full resize-none rounded-2xl border border-[var(--color-card-rule)] bg-white px-3.5 py-2.5 text-sm text-card-ink placeholder:text-[var(--color-card-muted)] focus-visible:outline-2 focus-visible:outline-paper"
                      />
                    </div>

                    <label className="flex items-start gap-2.5 rounded-2xl border border-[var(--color-card-rule)] bg-white/80 p-3.5 text-xs leading-relaxed text-[var(--color-card-muted)] cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={agreedTerms}
                        onChange={(e) => setAgreedTerms(e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-paper"
                      />
                      <span>
                        Saya paham ini adalah{" "}
                        <strong className="text-card-ink">mentoring akademik (bukan joki)</strong>,
                        reschedule gratis maks. H-1 (1x), dan sesi yang sudah berjalan
                        bersifat <strong className="text-card-ink">non-refundable</strong>.
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={submitting || !agreedTerms}
                      className="btn-primary w-full justify-center whitespace-nowrap"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          <span>Menyiapkan Pembayaran…</span>
                        </>
                      ) : (
                        <>
                          <span>Bayar Sekarang ({formatRupiah(dueNow)})</span>
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="order-success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.34, ease: APPLE_EASE }}
                    className="space-y-4"
                  >
                    <div className="rounded-2xl bg-paper p-5 text-ink">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-accent">
                          Kode Pesanan
                        </span>
                        <button
                          type="button"
                          onClick={() => copyText("code", createdOrder.orderCode)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-paper-2 px-3 py-1 text-xs font-bold text-ink transition-colors duration-200 hover:bg-accent hover:text-accent-ink active:translate-y-px cursor-pointer"
                        >
                          <span className="num">{createdOrder.orderCode}</span>
                          {copiedKey === "code" ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>

                      <div className="mt-4 border-t border-rule pt-4">
                        <p className="text-xs text-ink-2">
                          {formatPaymentPlanLabel(createdOrder.paymentPlan)}
                        </p>
                        <div className="mt-1 flex items-center justify-between gap-3">
                          <span className="num font-display text-2xl text-accent">
                            {formatRupiah(createdOrder.amountDueNow)}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              copyText("amount", String(createdOrder.amountDueNow))
                            }
                            className="inline-flex items-center gap-1 rounded-full bg-paper-2 px-3 py-1.5 text-xs font-bold text-ink transition-colors duration-200 hover:bg-accent hover:text-accent-ink active:translate-y-px cursor-pointer"
                          >
                            {copiedKey === "amount" ? (
                              <>
                                <Check className="h-3 w-3" />
                                <span>Tersalin</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Salin Nominal</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[var(--color-card-rule)] bg-white p-4">
                      <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-black/5 p-1">
                        <button
                          type="button"
                          onClick={() => setPayMethodTab("QRIS")}
                          className={`flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg text-xs font-bold transition-colors duration-200 cursor-pointer ${
                            payMethodTab === "QRIS"
                              ? "bg-paper text-ink"
                              : "text-[var(--color-card-muted)] hover:text-card-ink"
                          }`}
                        >
                          <QrCode className="h-3.5 w-3.5" aria-hidden="true" />
                          QRIS
                        </button>
                        <button
                          type="button"
                          onClick={() => setPayMethodTab("TRANSFER")}
                          className={`flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg text-xs font-bold transition-colors duration-200 cursor-pointer ${
                            payMethodTab === "TRANSFER"
                              ? "bg-paper text-ink"
                              : "text-[var(--color-card-muted)] hover:text-card-ink"
                          }`}
                        >
                          <Landmark className="h-3.5 w-3.5" aria-hidden="true" />
                          Transfer / E-Wallet
                        </button>
                      </div>

                      {payMethodTab === "QRIS" ? (
                        <div className="mt-4 text-center">
                          {settings.qris_image_url ? (
                            <>
                              <div className="mx-auto inline-block rounded-xl border border-[var(--color-card-rule)] bg-white p-2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={settings.qris_image_url}
                                  alt="QRIS Pembayaran TelisikRiset"
                                  width={256}
                                  height={256}
                                  className="mx-auto max-h-64 w-auto object-contain"
                                />
                              </div>
                              {settings.qris_merchant_name && (
                                <p className="mt-2.5 text-xs font-bold text-card-ink">
                                  QRIS resmi a.n.{" "}
                                  <span className="text-paper">
                                    {settings.qris_merchant_name}
                                  </span>
                                </p>
                              )}
                            </>
                          ) : (
                            <div className="rounded-xl border border-dashed border-[var(--color-card-rule)] bg-card px-4 py-6 text-xs text-[var(--color-card-muted)]">
                              QRIS belum diunggah admin. Pilih tab{" "}
                              <strong>Transfer / E-Wallet</strong> atau konfirmasi via chat.
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="mt-4 space-y-2 rounded-xl bg-card p-4 text-xs">
                          <div className="flex justify-between gap-3">
                            <span className="text-[var(--color-card-muted)]">Bank / E-Wallet</span>
                            <span className="font-bold text-card-ink">
                              {settings.bank_name || "Konfirmasi via chat"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-[var(--color-card-muted)]">No. Rekening</span>
                            <div className="flex items-center gap-1.5">
                              <span className="num font-bold text-card-ink">
                                {settings.bank_account_number || "-"}
                              </span>
                              {settings.bank_account_number && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    copyText("rek", settings.bank_account_number)
                                  }
                                  className="rounded-lg border border-[var(--color-card-rule)] bg-white px-2 py-0.5 text-xs font-bold text-card-ink cursor-pointer"
                                >
                                  {copiedKey === "rek" ? "Disalin" : "Salin"}
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between gap-3">
                            <span className="text-[var(--color-card-muted)]">Atas Nama</span>
                            <span className="font-bold text-card-ink">
                              {settings.bank_account_holder || "-"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2.5">
                      {telegramUrl && (
                        <a
                          href={telegramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary w-full justify-center whitespace-nowrap"
                        >
                          <Send className="h-4 w-4" aria-hidden="true" />
                          <span>Konfirmasi via Telegram</span>
                        </a>
                      )}

                      {lineUrl && (
                        <a
                          href={lineUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-dark-ink w-full justify-center whitespace-nowrap"
                        >
                          <MessageCircle className="h-4 w-4" aria-hidden="true" />
                          <span>Konfirmasi via LINE ({settings.admin_line})</span>
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => copyText("msg", formattedMessage)}
                        className="flex min-h-[44px] w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-2xl border border-[var(--color-card-rule)] bg-white px-5 py-2.5 text-xs font-bold text-card-ink transition-colors duration-200 hover:border-paper active:translate-y-px cursor-pointer"
                      >
                        {copiedKey === "msg" ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-paper" />
                            <span>Format Pesan Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Salin Format Konfirmasi</span>
                          </>
                        )}
                      </button>

                      <Link
                        href={`/pesanan/${createdOrder.orderCode}`}
                        className="flex w-full items-center justify-center gap-1.5 py-2 text-xs font-bold text-paper hover:underline"
                      >
                        <span>Buka Halaman Invoice</span>
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
