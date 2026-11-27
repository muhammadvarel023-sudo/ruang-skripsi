"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  Inbox,
  Layers,
  Settings,
  ExternalLink,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/pesanan", label: "Pesanan Masuk", icon: Inbox },
  { href: "/admin/layanan", label: "Layanan & Harga", icon: Layers },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-full flex-col border-b border-slate-200 bg-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F172A] text-white">
            <BookOpen className="h-4 w-4" />
          </span>
          <div className="leading-none">
            <span className="block text-sm font-semibold text-[#0F172A]">
              RuangSkripsi
            </span>
            <span className="block font-mono text-[10px] text-slate-400">
              ADMIN PANEL
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-1 lg:flex-col">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#0F172A] text-white"
                  : "text-slate-600 hover:bg-[#FAF9F6] hover:text-[#0F172A]"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="hidden border-t border-slate-100 p-4 lg:block">
        <p className="truncate text-xs font-medium text-slate-700">{email}</p>
        <p className="text-[11px] text-slate-400">Pengelola Platform</p>
        <div className="mt-3 flex flex-col gap-1.5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-[#FAF9F6] px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
          >
            Lihat Website
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            Keluar
          </button>
        </div>
      </div>
    </aside>
  );
}
