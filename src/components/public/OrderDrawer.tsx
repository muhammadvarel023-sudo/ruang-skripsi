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
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#090E1A]/55 backdrop-blur-[3px]"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="relative z-10 flex h-full w-full max-w-lg flex-col bg-[#F8FAFC] shadow-2xl border-l border-slate-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-[#090E1A] px-6 py-4 text-white">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-blue-300">
                  {createdOrder
                    ? "Langkah 2/2 — Pembayaran & Konfirmasi"
                    : "Langkah 1/2 — Biodata & Skema Bayar"}
                </p>
                <h3 className="text-base font-bold text-white">
                  {selected.pkg.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    {/* Package & Total Box */}
                    <div className="rounded-xl border-2 border-[#090E1A] bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="font-mono text-[11px] font-bold text-[#2563EB]">
                            {selected.category.name}
                          </span>
                          <p className="mt-0.5 text-sm font-bold text-[#090E1A]">
                            {selected.pkg.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-lg font-bold text-[#090E1A] tabular-nums">
                            {formatRupiah(totalPrice)}
                          </span>
                          {campusType === "NON_TELKOM" && (
                            <p className="font-mono text-[10px] text-[#EA580C]">
                              Dasar {formatRupiah(basePrice)} + {formatRupiah(surcharge)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Campus selector */}
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Asal Kampus <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setCampusType("TELKOM_FKS")}
                          className={`flex items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                            campusType === "TELKOM_FKS"
                              ? "border-[#090E1A] bg-[#090E1A] text-white"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                          }`}
                        >
                          <GraduationCap className="h-3.5 w-3.5" />
                          Telkom Univ (FKS)
                        </button>
                        <button
                          type="button"
                          onClick={() => setCampusType("NON_TELKOM")}
                          className={`flex items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                            campusType === "NON_TELKOM"
                              ? "border-[#EA580C] bg-[#EA580C] text-white"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                          }`}
                        >
                          <Building2 className="h-3.5 w-3.5" />
                          PTS Bandung (+{formatRupiah(settings.non_telkom_surcharge)})
                        </button>
                      </div>
                    </div>

                    {campusType === "NON_TELKOM" && (
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                          Pilih Kampus Swasta Wilayah Bandung <span className="text-rose-500">*</span>
                        </label>
                        <select
                          required
                          value={campusName}
                          onChange={(e) => setCampusName(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#090E1A] outline-none focus:border-[#2563EB]"
                        >
                          {BANDUNG_PRIVATE_CAMPUSES.map((campus) => (
                            <option key={campus} value={campus}>
                              {campus}
                            </option>
                          ))}
                        </select>
                        <p className="mt-1 text-[11px] text-slate-500">
                          Saat ini layanan di luar Telkom University hanya tersedia untuk kampus
                          swasta wilayah Bandung dengan jurusan relevan (Komunikasi / Sosial).
                        </p>
                      </div>
                    )}

                    {/* Payment Plan Selector (DP 50% vs FULL) */}
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Skema Pembayaran <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPaymentPlan("DP_50")}
                          className={`rounded-xl border-2 p-3 text-left transition-all cursor-pointer ${
                            paymentPlan === "DP_50"
                              ? "border-[#2563EB] bg-blue-50/70"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#090E1A]">
                              DP 50% Dulu
                            </span>
                            <Wallet className="h-3.5 w-3.5 text-[#2563EB]" />
                          </div>
                          <p className="mt-1 font-mono text-sm font-bold text-[#2563EB] tabular-nums">
                            {formatRupiah(Math.ceil(totalPrice / 2))}
                          </p>
                          <p className="mt-0.5 text-[10px] text-slate-500">
                            Lock jadwal sesi 1
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentPlan("FULL")}
                          className={`rounded-xl border-2 p-3 text-left transition-all cursor-pointer ${
                            paymentPlan === "FULL"
                              ? "border-[#059669] bg-emerald-50/70"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#090E1A]">
                              Bayar Lunas
                            </span>
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#059669]" />
                          </div>
                          <p className="mt-1 font-mono text-sm font-bold text-[#059669] tabular-nums">
                            {formatRupiah(totalPrice)}
                          </p>
                          <p className="mt-0.5 text-[10px] text-slate-500">
                            Sekali bayar beres
                          </p>
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
                        {error}
                      </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                          Nama Lengkap <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="Contoh: Nadia Kartika"
                          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#090E1A] outline-none focus:border-[#2563EB]"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                          Prodi / Konsentrasi <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={major}
                          onChange={(e) => setMajor(e.target.value)}
                          placeholder="Cth: Ilmu Komunikasi / Digital PR"
                          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#090E1A] outline-none focus:border-[#2563EB]"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                          Username Telegram / ID LINE <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={contactHandle}
                          onChange={(e) => setContactHandle(e.target.value)}
                          placeholder="Cth: @nadiakartika"
                          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#090E1A] outline-none focus:border-[#2563EB]"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                          Pendekatan Kualitatif
                        </label>
                        <select
                          value={researchType}
                          onChange={(e) => setResearchType(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#090E1A] outline-none focus:border-[#2563EB]"
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
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Topik atau Rancangan Judul Komunikasi <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={topicOrTitle}
                        onChange={(e) => setTopicOrTitle(e.target.value)}
                        placeholder="Tulis fenomena komunikasi atau judul sementaramu"
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#090E1A] outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Kendala atau Catatan Tambahan (Opsional)
                      </label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ceritakan singkat progres atau revisi dari dosen pembimbing..."
                        className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#090E1A] outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    {/* Mandatory Terms & Refund Policy Checkbox */}
                    <label className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3.5 text-[11px] leading-relaxed text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={agreedTerms}
                        onChange={(e) => setAgreedTerms(e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-[#090E1A]"
                      />
                      <span>
                        Saya memahami bahwa layanan ini adalah{" "}
                        <strong className="text-[#090E1A]">pendampingan akademik (bukan joki)</strong>,
                        keputusan ACC berada di tangan dosen pembimbing, reschedule gratis maks. H-1
                        (1x), dan pembayaran untuk sesi yang sudah berjalan bersifat{" "}
                        <strong className="text-[#090E1A]">non-refundable</strong> (untuk paket DP
                        50%, kamu bebas tidak melanjutkan sesi berikutnya tanpa melunasi sisa).
                      </span>
                    </label>

                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={submitting || !agreedTerms}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F97316] px-5 py-3.5 text-sm font-bold text-white shadow-[0_6px_18px_-6px_rgba(249,115,22,0.55)] transition-all hover:bg-[#EA580C] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Membuat Ringkasan &amp; Pembayaran...
                          </>
                        ) : (
                          <>
                            Lanjut ke Pembayaran ({formatRupiah(dueNow)})
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="order-success"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-4"
                  >
                    {/* Order Code & Amount Due Banner */}
                    <div className="rounded-2xl border-2 border-[#090E1A] bg-[#090E1A] p-5 text-white">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-blue-300">
                          Kode Pesanan
                        </span>
                        <button
                          type="button"
                          onClick={() => copyText("code", createdOrder.orderCode)}
                          className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 font-mono text-xs font-bold text-white hover:bg-white/20 cursor-pointer"
                        >
                          {createdOrder.orderCode}
                          {copiedKey === "code" ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>

                      <div className="mt-4 border-t border-white/15 pt-4">
                        <p className="text-xs text-slate-300">
                          {formatPaymentPlanLabel(createdOrder.paymentPlan)}
                        </p>
                        <div className="mt-1 flex items-center justify-between gap-3">
                          <span className="font-mono text-2xl font-bold text-[#FDBA74] tabular-nums">
                            {formatRupiah(createdOrder.amountDueNow)}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              copyText("amount", String(createdOrder.amountDueNow))
                            }
                            className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-white/20 cursor-pointer"
                          >
                            {copiedKey === "amount" ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-400" />
                                Tersalin
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                Salin Nominal
                              </>
                            )}
                          </button>
                        </div>
                        {createdOrder.paymentPlan === "DP_50" && (
                          <p className="mt-1 text-[11px] text-slate-400">
                            Total paket {formatRupiah(createdOrder.priceSnapshot)} — pelunasan
                            sisa 50% sebelum sesi lanjutan.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Payment Method Box: QRIS & Transfer Bank */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-slate-100 p-1">
                        <button
                          type="button"
                          onClick={() => setPayMethodTab("QRIS")}
                          className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-colors cursor-pointer ${
                            payMethodTab === "QRIS"
                              ? "bg-[#090E1A] text-white"
                              : "text-slate-600 hover:text-[#090E1A]"
                          }`}
                        >
                          <QrCode className="h-3.5 w-3.5" />
                          QRIS
                        </button>
                        <button
                          type="button"
                          onClick={() => setPayMethodTab("TRANSFER")}
                          className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-colors cursor-pointer ${
                            payMethodTab === "TRANSFER"
                              ? "bg-[#090E1A] text-white"
                              : "text-slate-600 hover:text-[#090E1A]"
                          }`}
                        >
                          <Landmark className="h-3.5 w-3.5" />
                          Transfer / E-Wallet
                        </button>
                      </div>

                      {payMethodTab === "QRIS" ? (
                        <div className="mt-4 text-center">
                          {settings.qris_image_url ? (
                            <>
                              <div className="mx-auto inline-block overflow-hidden rounded-xl border border-slate-200 bg-white p-2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={settings.qris_image_url}
                                  alt="QRIS Pembayaran RuangSkripsi"
                                  className="mx-auto max-h-64 w-auto rounded-lg object-contain"
                                />
                              </div>
                              {settings.qris_merchant_name && (
                                <p className="mt-2.5 text-xs font-semibold text-[#090E1A]">
                                  QRIS resmi a.n.{" "}
                                  <span className="text-[#2563EB]">
                                    {settings.qris_merchant_name}
                                  </span>
                                </p>
                              )}
                              <p className="mt-1 text-[11px] text-slate-500">
                                Scan via m-Banking / GoPay / DANA / OVO / ShopeePay, lalu kirim
                                bukti bayar lewat tombol di bawah.
                              </p>
                            </>
                          ) : (
                            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-xs text-slate-500">
                              Gambar QRIS belum diunggah admin. Silakan pilih tab{" "}
                              <strong>Transfer / E-Wallet</strong> atau konfirmasi langsung via
                              Telegram / LINE di bawah.
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="mt-4 space-y-2.5 rounded-xl bg-[#F8FAFC] p-4 text-xs">
                          <div className="flex justify-between gap-3">
                            <span className="text-slate-500">Bank / E-Wallet</span>
                            <span className="font-bold text-[#090E1A]">
                              {settings.bank_name || "Konfirmasi via Telegram / LINE"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-slate-500">No. Rekening / ID</span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-[#090E1A]">
                                {settings.bank_account_number || "-"}
                              </span>
                              {settings.bank_account_number && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    copyText("rek", settings.bank_account_number)
                                  }
                                  className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                                >
                                  {copiedKey === "rek" ? "Disalin!" : "Salin"}
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between gap-3">
                            <span className="text-slate-500">Atas Nama</span>
                            <span className="font-semibold text-[#090E1A]">
                              {settings.bank_account_holder || "-"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirmation Buttons */}
                    <div className="space-y-2.5">
                      <p className="text-center text-xs font-semibold text-slate-600">
                        Sudah bayar? Kirim bukti transfer &amp; atur jadwal sesi di sini:
                      </p>

                      {telegramUrl && (
                        <a
                          href={telegramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0284C7] px-5 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#0369A1]"
                        >
                          <Send className="h-4 w-4" />
                          Konfirmasi &amp; Kirim Bukti via Telegram
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

                      <button
                        type="button"
                        onClick={() => copyText("msg", formattedMessage)}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
                      >
                        {copiedKey === "msg" ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-[#10B981]" />
                            Format Pesan Tersalin! Tinggal Paste di LINE / Telegram
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            Salin Format Pesan Konfirmasi
                          </>
                        )}
                      </button>

                      <Link
                        href={`/pesanan/${createdOrder.orderCode}`}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl px-5 py-2 text-xs font-semibold text-slate-500 hover:text-[#090E1A]"
                      >
                        Buka Halaman Invoice &amp; Status Pesanan
                        <ExternalLink className="h-3.5 w-3.5" />
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
