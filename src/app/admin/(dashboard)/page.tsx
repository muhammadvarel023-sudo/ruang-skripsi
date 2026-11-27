import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRupiah, ORDER_STATUS_META } from "@/lib/format";
import { ArrowRight, Inbox, Layers, CheckCircle2, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [orders, packageCount, activePackageCount] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.package.count(),
    prisma.package.count({ where: { isActive: true } }),
  ]);

  const totalOrders = orders.length;
  const waitingCount = orders.filter(
    (o) => o.status === "PENDING" || o.status === "WAITING_CONFIRMATION"
  ).length;
  const inProgressCount = orders.filter((o) => o.status === "IN_PROGRESS").length;
  const completedCount = orders.filter((o) => o.status === "COMPLETED").length;

  const recentOrders = orders.slice(0, 6);

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-slate-400">
            Dashboard Pengelola
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#0F172A]">
            Ringkasan Aktivitas
          </h1>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/layanan"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
          >
            Kelola Paket & Harga
          </Link>
          <Link
            href="/admin/pesanan"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F172A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E3A5F]"
          >
            Lihat Semua Pesanan
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Permintaan",
            value: totalOrders,
            sub: "Semua pesanan tercatat",
            icon: Inbox,
          },
          {
            label: "Perlu Ditindaklanjuti",
            value: waitingCount,
            sub: "Pending & Menunggu Konfirmasi",
            icon: Clock,
          },
          {
            label: "Sedang Berlangsung",
            value: inProgressCount,
            sub: "Sesi aktif saat ini",
            icon: Layers,
          },
          {
            label: "Paket Aktif",
            value: `${activePackageCount}/${packageCount}`,
            sub: `${completedCount} sesi selesai`,
            icon: CheckCircle2,
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.03)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                {kpi.label}
              </span>
              <kpi.icon className="h-4 w-4 text-slate-400" />
            </div>
            <p className="mt-3 font-mono text-2xl font-semibold text-[#0F172A] tabular-nums">
              {kpi.value}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-sm font-semibold text-[#0F172A]">
            Permintaan Layanan Terbaru
          </h2>
          <Link
            href="/admin/pesanan"
            className="text-xs font-semibold text-[#1E3A5F] hover:underline"
          >
            Kelola semua &rarr;
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-slate-500">
            Belum ada permintaan layanan masuk.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-[#FAF9F6] text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-3">Kode</th>
                  <th className="px-6 py-3">Mahasiswa</th>
                  <th className="px-6 py-3">Paket</th>
                  <th className="px-6 py-3">Tarif</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order) => {
                  const meta =
                    ORDER_STATUS_META[order.status] ?? ORDER_STATUS_META.PENDING;
                  return (
                    <tr key={order.id} className="hover:bg-[#FAF9F6]/60">
                      <td className="px-6 py-3.5 font-mono text-xs font-semibold text-[#0F172A]">
                        {order.orderCode}
                      </td>
                      <td className="px-6 py-3.5">
                        <p className="font-medium text-[#0F172A]">
                          {order.studentName}
                        </p>
                        <p className="text-xs text-slate-500">{order.major}</p>
                      </td>
                      <td className="px-6 py-3.5">
                        <p className="font-medium text-[#0F172A]">
                          {order.packageNameSnapshot}
                        </p>
                        <p className="text-xs text-slate-400">
                          {order.categoryNameSnapshot}
                        </p>
                      </td>
                      <td className="px-6 py-3.5 font-mono text-xs font-semibold text-[#0F172A] tabular-nums">
                        {formatRupiah(order.priceSnapshot)}
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${meta.bg} ${meta.text}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                          {meta.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
