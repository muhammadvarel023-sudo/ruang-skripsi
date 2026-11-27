"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Loader2,
  Copy,
  Check,
  ExternalLink,
  GraduationCap,
  Building2,
} from "lucide-react";
import type {
  CampusType,
  CategoryDTO,
  OrderDTO,
  PackageDTO,
  SiteSettings,
} from "@/lib/types";
import { buildWhatsAppUrl, formatRupiah } from "@/lib/format";

interface OrderDrawerProps {
  selected: { pkg: PackageDTO; category: CategoryDTO } | null;
  initialCampusType: CampusType;
  settings: SiteSettings;
  onClose: () => void;
}

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
  const [campusName, setCampusName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [major, setMajor] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [researchType, setResearchType] = useState(QUALITATIVE_APPROACHES[0]);
  const [topicOrTitle, setTopicOrTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<OrderDTO | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (selected) {
      setCampusType(initialCampusType);
      setError(null);
      setCreatedOrder(null);
      setCopied(false);
    }
  }, [selected, initialCampusType]);

  const basePrice = selected
    ? selected.pkg.discountPrice && selected.pkg.discountPrice < selected.pkg.price
      ? selected.pkg.discountPrice
      : selected.pkg.price
    : 0;
  const surcharge =
    campusType === "NON_TELKOM" ? settings.non_telkom_surcharge : 0;
  const totalPrice = basePrice + surcharge;

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
          studentName,
          major,
          whatsapp,
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

  const waUrl = createdOrder
    ? buildWhatsAppUrl(settings.admin_whatsapp, settings.wa_template, {
        orderCode: createdOrder.orderCode,
        studentName: createdOrder.studentName,
        campusName: createdOrder.campusName,
        major: createdOrder.major,
        categoryName: createdOrder.categoryNameSnapshot,
        packageName: createdOrder.packageNameSnapshot,
        price: createdOrder.priceSnapshot,
        researchType: createdOrder.researchType,
        topicOrTitle: createdOrder.topicOrTitle,
      })
    : "#";

  const handleCopyCode = () => {
    if (!createdOrder) return;
    navigator.clipboard.writeText(createdOrder.orderCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                  {createdOrder ? "Ringkasan Permintaan" : "Formulir Permintaan Layanan"}
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
                    {/* Selected package + dynamic price summary box */}
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

                    {/* Campus Type Selector inside drawer */}
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
                          Luar Tel-U (+{formatRupiah(settings.non_telkom_surcharge)})
                        </button>
                      </div>
                    </div>

                    {campusType === "NON_TELKOM" && (
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                          Nama Universitas Asal <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={campusName}
                          onChange={(e) => setCampusName(e.target.value)}
                          placeholder="Contoh: Universitas Padjadjaran"
                          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#090E1A] outline-none focus:border-[#2563EB]"
                        />
                      </div>
                    )}

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
                          Nomor WhatsApp <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          placeholder="0812xxxxxxxx"
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
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ceritakan singkat progres atau catatan revisi dari dosen pembimbing..."
                        className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#090E1A] outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F97316] px-5 py-3.5 text-sm font-bold text-white shadow-[0_6px_18px_-6px_rgba(249,115,22,0.55)] transition-all hover:bg-[#EA580C] disabled:opacity-60 cursor-pointer"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Menyimpan Permintaan...
                          </>
                        ) : (
                          <>
                            Kirim Permintaan Layanan
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                      <p className="mt-2.5 text-center text-[11px] text-slate-500">
                        Khusus penelitian kualitatif bidang Komunikasi. Tidak ada pembayaran langsung
                        sebelum konfirmasi jadwal via WhatsApp.
                      </p>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="order-success"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-5"
                  >
                    <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-50 p-5 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#10B981] text-white">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <h4 className="mt-3 text-lg font-bold text-[#090E1A]">
                        Permintaan Berhasil Dicatat
                      </h4>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">
                        Simpan kode pesanan di bawah ini lalu klik tombol WhatsApp untuk
                        konfirmasi jadwal sesi pendampingan.
                      </p>

                      <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2">
                        <span className="font-mono text-sm font-bold tracking-wider text-[#090E1A]">
                          {createdOrder.orderCode}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyCode}
                          className="text-slate-400 hover:text-[#090E1A] cursor-pointer"
                          title="Salin kode pesanan"
                        >
                          {copied ? (
                            <Check className="h-4 w-4 text-[#10B981]" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Ringkasan Layanan
                      </p>
                      <dl className="mt-3 space-y-2.5 text-xs">
                        <div className="flex justify-between gap-4">
                          <dt className="text-slate-500">Kategori</dt>
                          <dd className="font-semibold text-[#090E1A] text-right">
                            {createdOrder.categoryNameSnapshot}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-slate-500">Paket</dt>
                          <dd className="font-bold text-[#090E1A] text-right">
                            {createdOrder.packageNameSnapshot}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-slate-500">Asal Kampus</dt>
                          <dd className="font-semibold text-[#2563EB] text-right">
                            {createdOrder.campusName}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-slate-500">Estimasi Tarif</dt>
                          <dd className="font-mono font-bold text-[#090E1A]">
                            {formatRupiah(createdOrder.priceSnapshot)}
                          </dd>
                        </div>
                        <div className="border-t border-slate-100 pt-2.5 flex justify-between gap-4">
                          <dt className="text-slate-500">Mahasiswa</dt>
                          <dd className="font-semibold text-[#090E1A] text-right">
                            {createdOrder.studentName} ({createdOrder.major})
                          </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-slate-500">Pendekatan Kualitatif</dt>
                          <dd className="font-semibold text-[#090E1A]">
                            {createdOrder.researchType}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-slate-500">Topik / Judul</dt>
                          <dd className="mt-1 rounded-lg bg-[#F8FAFC] p-2.5 font-medium text-slate-700">
                            {createdOrder.topicOrTitle}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="space-y-2.5">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#059669] px-5 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#047857]"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Konfirmasi via WhatsApp
                      </a>

                      <Link
                        href={`/pesanan/${createdOrder.orderCode}`}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        Buka Halaman Ringkasan Pesanan
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
