"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  MessageCircle,
  Trash2,
  Eye,
  Loader2,
} from "lucide-react";
import type { OrderDTO } from "@/lib/types";
import {
  formatPaymentPlanLabel,
  formatRupiah,
  ORDER_STATUS_META,
  PAYMENT_STATUS_META,
} from "@/lib/format";

const STATUS_OPTIONS = [
  { key: "ALL", label: "Semua" },
  { key: "PENDING", label: "Pending" },
  { key: "WAITING_CONFIRMATION", label: "Menunggu Konfirmasi" },
  { key: "IN_PROGRESS", label: "Sedang Berlangsung" },
  { key: "COMPLETED", label: "Selesai" },
  { key: "CANCELLED", label: "Dibatalkan" },
];

export function OrdersClient({ initialOrders }: { initialOrders: OrderDTO[] }) {
  const [orders, setOrders] = useState<OrderDTO[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [activeOrder, setActiveOrder] = useState<OrderDTO | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "ALL" && o.status !== statusFilter) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        o.orderCode.toLowerCase().includes(q) ||
        o.studentName.toLowerCase().includes(q) ||
        o.major.toLowerCase().includes(q) ||
        o.packageNameSnapshot.toLowerCase().includes(q)
      );
    });
  }, [orders, statusFilter, query]);

  async function handleStatusChange(orderId: string, newStatus: string) {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (activeOrder?.id === orderId) {
          setActiveOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } finally {
      setUpdatingId(null);
    }
  }

  async function handlePaymentStatusChange(
    orderId: string,
    newPaymentStatus: string
  ) {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: newPaymentStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, paymentStatus: newPaymentStatus } : o
          )
        );
        if (activeOrder?.id === orderId) {
          setActiveOrder((prev) =>
            prev ? { ...prev, paymentStatus: newPaymentStatus } : null
          );
        }
      }
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(orderId: string) {
    if (!confirm("Hapus catatan pesanan ini secara permanen?")) return;
    const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
    if (res.ok) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      if (activeOrder?.id === orderId) setActiveOrder(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-slate-400">
          Manajemen Pesanan
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#0F172A]">
          Daftar Permintaan Layanan
        </h1>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setStatusFilter(opt.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === opt.key
                  ? "bg-[#0F172A] text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari kode, nama, prodi..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-[#0F172A] outline-none focus:border-[#1E3A5F]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white">
        {filtered.length === 0 ? (
          <div className="px-6 py-14 text-center text-sm text-slate-500">
            Tidak ada pesanan yang cocok dengan filter saat ini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-[#FAF9F6] text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3">Kode</th>
                  <th className="px-5 py-3">Mahasiswa</th>
                  <th className="px-5 py-3">Paket Layanan</th>
                  <th className="px-5 py-3">Tarif</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((order) => {
                  const meta =
                    ORDER_STATUS_META[order.status] ?? ORDER_STATUS_META.PENDING;
                  return (
                    <tr
                      key={order.id}
                      className="transition-colors hover:bg-[#FAF9F6]/70"
                    >
                      <td className="px-5 py-3.5 font-mono text-xs font-semibold text-[#0F172A]">
                        {order.orderCode}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-[#0F172A]">
                          {order.studentName}
                        </p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                              order.campusType === "TELKOM_FKS"
                                ? "bg-blue-100 text-[#1D4ED8]"
                                : "bg-orange-100 text-[#C2410C]"
                            }`}
                          >
                            {order.campusType === "TELKOM_FKS"
                              ? "Tel-U FKS"
                              : "Luar Tel-U"}
                          </span>
                          <span className="text-xs text-slate-500">
                            {order.major}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-[#0F172A]">
                          {order.packageNameSnapshot}
                        </p>
                        <p className="text-xs text-slate-400">
                          {order.categoryNameSnapshot}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-mono text-xs font-semibold text-[#0F172A] tabular-nums">
                          {formatRupiah(order.priceSnapshot)}
                        </p>
                        {(() => {
                          const pMeta =
                            PAYMENT_STATUS_META[order.paymentStatus] ??
                            PAYMENT_STATUS_META.UNPAID;
                          return (
                            <span
                              className={`mt-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${pMeta.bg} ${pMeta.text}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${pMeta.dot}`}
                              />
                              {pMeta.label}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${meta.bg} ${meta.text}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setActiveOrder(order)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:text-[#0F172A] cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Drawer */}
      <AnimatePresence>
        {activeOrder && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveOrder(null)}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-[2px]"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="relative z-10 flex h-full w-full max-w-md flex-col bg-[#FAF9F6] shadow-2xl border-l border-slate-200"
            >
              <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
                <div>
                  <p className="font-mono text-xs font-semibold text-[#1E3A5F]">
                    {activeOrder.orderCode}
                  </p>
                  <h3 className="text-base font-semibold text-[#0F172A]">
                    Detail Permintaan
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveOrder(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm">
                {/* Status & Payment status selectors */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <label className="mb-1.5 flex items-center justify-between text-xs font-semibold text-slate-600">
                      <span>Status Pesanan</span>
                      {updatingId === activeOrder.id && (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
                      )}
                    </label>
                    <select
                      value={activeOrder.status}
                      onChange={(e) =>
                        handleStatusChange(activeOrder.id, e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-300 bg-[#FAF9F6] px-3 py-2 text-xs font-medium text-[#0F172A] outline-none focus:border-[#1E3A5F]"
                    >
                      {STATUS_OPTIONS.filter((s) => s.key !== "ALL").map((opt) => (
                        <option key={opt.key} value={opt.key}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                      Status Pembayaran
                    </label>
                    <select
                      value={activeOrder.paymentStatus}
                      onChange={(e) =>
                        handlePaymentStatusChange(activeOrder.id, e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-300 bg-[#FAF9F6] px-3 py-2 text-xs font-medium text-[#0F172A] outline-none focus:border-[#1E3A5F]"
                    >
                      <option value="UNPAID">Belum Dibayar</option>
                      <option value="DP_PAID">DP 50% Masuk</option>
                      <option value="PAID">Lunas</option>
                    </select>
                  </div>
                </div>

                {/* Package Info */}
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Paket &amp; Skema Bayar
                  </p>
                  <p className="mt-1 font-semibold text-[#0F172A]">
                    {activeOrder.packageNameSnapshot}
                  </p>
                  <p className="text-xs text-slate-500">
                    {activeOrder.categoryNameSnapshot} &bull;{" "}
                    {formatPaymentPlanLabel(activeOrder.paymentPlan)}
                  </p>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="font-mono text-base font-semibold text-[#0F172A]">
                      Total: {formatRupiah(activeOrder.priceSnapshot)}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#EA580C]">
                      Tagihan Awal:{" "}
                      {formatRupiah(
                        activeOrder.amountDueNow > 0
                          ? activeOrder.amountDueNow
                          : activeOrder.priceSnapshot
                      )}
                    </span>
                  </div>
                </div>

                {/* Student Info */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2.5 text-xs">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Data Mahasiswa
                  </p>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nama</span>
                    <span className="font-semibold text-[#0F172A]">
                      {activeOrder.studentName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Asal Kampus</span>
                    <span className="font-semibold text-[#2563EB]">
                      {activeOrder.campusName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Prodi</span>
                    <span className="font-medium text-[#0F172A]">
                      {activeOrder.major}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Telegram / LINE</span>
                    <span className="font-mono text-[#0F172A]">
                      {activeOrder.whatsapp}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pendekatan</span>
                    <span className="font-medium text-[#0F172A]">
                      {activeOrder.researchType}
                    </span>
                  </div>
                </div>

                {/* Topic & Notes */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 text-xs">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Topik / Rancangan Judul
                    </p>
                    <p className="mt-1 font-medium leading-relaxed text-[#0F172A]">
                      {activeOrder.topicOrTitle}
                    </p>
                  </div>
                  {activeOrder.notes && (
                    <div className="border-t border-slate-100 pt-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Catatan Mahasiswa
                      </p>
                      <p className="mt-1 leading-relaxed text-slate-600">
                        {activeOrder.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 border-t border-slate-200 bg-white p-4">
                <a
                  href={`https://t.me/${encodeURIComponent(
                    activeOrder.whatsapp.trim().replace(/^@+/, "")
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0284C7] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0369A1]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Buka Telegram ({activeOrder.whatsapp})
                </a>
                <button
                  type="button"
                  onClick={() => handleDelete(activeOrder.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                  title="Hapus pesanan"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
