"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Save } from "lucide-react";
import type { SiteSettings } from "@/lib/types";

export function SettingsClient({
  initialSettings,
}: {
  initialSettings: SiteSettings;
}) {
  const [brandName, setBrandName] = useState(initialSettings.brand_name);
  const [adminTelegram, setAdminTelegram] = useState(
    initialSettings.admin_telegram
  );
  const [adminLine, setAdminLine] = useState(initialSettings.admin_line);
  const [nonTelkomSurcharge, setNonTelkomSurcharge] = useState(
    String(initialSettings.non_telkom_surcharge)
  );
  const [waTemplate, setWaTemplate] = useState(initialSettings.wa_template);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand_name: brandName,
          admin_telegram: adminTelegram,
          admin_line: adminLine,
          non_telkom_surcharge: Number(nonTelkomSurcharge) || 0,
          wa_template: waTemplate,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-slate-400">
          Konfigurasi Platform
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#090E1A]">
          Pengaturan Tarif Kampus, Telegram &amp; LINE
        </h1>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6"
      >
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-700">
            Nama Brand / Platform
          </label>
          <input
            type="text"
            required
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-[#090E1A] outline-none focus:border-[#2563EB]"
          />
        </div>

        <div className="rounded-xl border border-orange-200 bg-orange-50/70 p-4">
          <label className="mb-1.5 block text-xs font-bold text-[#C2410C]">
            Tambahan Biaya di Luar Telkom University (Rp)
          </label>
          <input
            type="number"
            min={0}
            step={5000}
            required
            value={nonTelkomSurcharge}
            onChange={(e) => setNonTelkomSurcharge(e.target.value)}
            className="w-full rounded-xl border border-orange-300 bg-white px-3.5 py-2.5 font-mono text-sm font-bold text-[#090E1A] outline-none focus:border-[#EA580C]"
          />
          <p className="mt-1.5 text-[11px] text-slate-600">
            Harga dasar paket berlaku untuk mahasiswa{" "}
            <strong>Telkom University (FKS)</strong>. Nominal ini otomatis ditambahkan untuk
            mahasiswa di luar Telkom University.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700">
              Username Telegram Admin (Tanpa @)
            </label>
            <input
              type="text"
              value={adminTelegram}
              onChange={(e) => setAdminTelegram(e.target.value)}
              placeholder="cth: ruangskripsi"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 font-mono text-sm text-[#090E1A] outline-none focus:border-[#0284C7]"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Kosongkan jika tidak ingin menampilkan tombol Telegram.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700">
              ID LINE Admin
            </label>
            <input
              type="text"
              value={adminLine}
              onChange={(e) => setAdminLine(e.target.value)}
              placeholder="cth: ruangskripsi"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 font-mono text-sm text-[#090E1A] outline-none focus:border-[#06C755]"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Kosongkan jika tidak ingin menampilkan tombol LINE.
            </p>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-700">
            Template Pesan Otomatis Konfirmasi (Telegram &amp; Salin untuk LINE)
          </label>
          <textarea
            rows={7}
            required
            value={waTemplate}
            onChange={(e) => setWaTemplate(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 font-mono text-xs leading-relaxed text-[#090E1A] outline-none focus:border-[#2563EB]"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[
              "{{orderCode}}",
              "{{studentName}}",
              "{{campusName}}",
              "{{major}}",
              "{{categoryName}}",
              "{{packageName}}",
              "{{price}}",
              "{{researchType}}",
              "{{topicOrTitle}}",
            ].map((v) => (
              <span
                key={v}
                className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-600"
              >
                {v}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#059669]">
                <CheckCircle2 className="h-4 w-4" />
                Pengaturan berhasil disimpan!
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#090E1A] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#2563EB] disabled:opacity-60 cursor-pointer"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            Simpan Pengaturan
          </button>
        </div>
      </form>
    </div>
  );
}
