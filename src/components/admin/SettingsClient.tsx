"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Save, Upload, Trash2 } from "lucide-react";
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
  const [addonSessionPrice, setAddonSessionPrice] = useState(
    String(initialSettings.addon_session_price)
  );
  const [qrisImageUrl, setQrisImageUrl] = useState(
    initialSettings.qris_image_url
  );
  const [qrisMerchantName, setQrisMerchantName] = useState(
    initialSettings.qris_merchant_name
  );
  const [bankName, setBankName] = useState(initialSettings.bank_name);
  const [bankAccountNumber, setBankAccountNumber] = useState(
    initialSettings.bank_account_number
  );
  const [bankAccountHolder, setBankAccountHolder] = useState(
    initialSettings.bank_account_holder
  );
  const [waTemplate, setWaTemplate] = useState(initialSettings.wa_template);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  function handleQrisUpload(e: React.ChangeEvent<HTMLInputElement>) {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      setUploadError("Ukuran gambar QRIS maksimal 1,5 MB agar cepat dimuat.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setQrisImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

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
          addon_session_price: Number(addonSessionPrice) || 60000,
          qris_image_url: qrisImageUrl,
          qris_merchant_name: qrisMerchantName,
          bank_name: bankName,
          bank_account_number: bankAccountNumber,
          bank_account_holder: bankAccountHolder,
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
    <div className="max-w-3xl space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-slate-400">
          Konfigurasi Platform
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#090E1A]">
          Pengaturan Tarif, Pembayaran (QRIS / Bank), Telegram &amp; LINE
        </h1>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6"
      >
        {/* Brand & Pricing */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            1. Identitas &amp; Aturan Tarif
          </h2>
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-orange-200 bg-orange-50/70 p-4">
              <label className="mb-1.5 block text-xs font-bold text-[#C2410C]">
                Tambahan Biaya Luar Tel-U (Rp)
              </label>
              <input
                type="number"
                min={0}
                step={5000}
                required
                value={nonTelkomSurcharge}
                onChange={(e) => setNonTelkomSurcharge(e.target.value)}
                className="w-full rounded-xl border border-orange-300 bg-white px-3.5 py-2 font-mono text-sm font-bold text-[#090E1A] outline-none focus:border-[#EA580C]"
              />
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4">
              <label className="mb-1.5 block text-xs font-bold text-[#1D4ED8]">
                Tarif Sesi Lanjutan / Add-on (Rp)
              </label>
              <input
                type="number"
                min={0}
                step={5000}
                required
                value={addonSessionPrice}
                onChange={(e) => setAddonSessionPrice(e.target.value)}
                className="w-full rounded-xl border border-blue-300 bg-white px-3.5 py-2 font-mono text-sm font-bold text-[#090E1A] outline-none focus:border-[#2563EB]"
              />
              <p className="mt-1 text-[10px] text-slate-600">
                Tampil otomatis di setiap kartu paket sebagai info sesi tambahan.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Methods: QRIS & Bank */}
        <div className="space-y-4 border-t border-slate-100 pt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            2. Metode Pembayaran (QRIS &amp; Transfer Bank / E-Wallet)
          </h2>

          <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-700">
                Gambar QRIS Pembayaran
              </label>
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1.5 rounded-lg bg-[#090E1A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#2563EB] cursor-pointer">
                  <Upload className="h-3.5 w-3.5" />
                  Upload Gambar QRIS
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQrisUpload}
                    className="hidden"
                  />
                </label>
                {qrisImageUrl && (
                  <button
                    type="button"
                    onClick={() => setQrisImageUrl("")}
                    className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Hapus
                  </button>
                )}
              </div>
            </div>

            {uploadError && (
              <p className="text-xs font-semibold text-rose-600">{uploadError}</p>
            )}

            {qrisImageUrl ? (
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrisImageUrl}
                  alt="Preview QRIS"
                  className="h-28 w-28 rounded-xl border border-slate-200 bg-white object-contain p-1"
                />
                <p className="text-xs text-slate-500">
                  Gambar QRIS siap ditampilkan di halaman pembayaran mahasiswa. Jangan lupa klik{" "}
                  <strong>Simpan Pengaturan</strong> di bawah.
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Belum ada gambar QRIS. Upload foto/screenshot QRIS-mu (maks 1,5 MB).
              </p>
            )}

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">
                Nama Merchant pada QRIS (ditulis transparan di bawah QR)
              </label>
              <input
                type="text"
                value={qrisMerchantName}
                onChange={(e) => setQrisMerchantName(e.target.value)}
                placeholder="Cth: Toko Varel / RuangSkripsi"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-[#090E1A] outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">
                Bank / E-Wallet
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Cth: SeaBank / BCA / DANA"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-[#2563EB]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">
                Nomor Rekening / ID
              </label>
              <input
                type="text"
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
                placeholder="Cth: 901234567890"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono text-xs outline-none focus:border-[#2563EB]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">
                Atas Nama
              </label>
              <input
                type="text"
                value={bankAccountHolder}
                onChange={(e) => setBankAccountHolder(e.target.value)}
                placeholder="Cth: Muhammad Varel"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>
        </div>

        {/* Contact: Telegram & LINE */}
        <div className="space-y-4 border-t border-slate-100 pt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            3. Kontak Konfirmasi (Tanpa Nomor HP)
          </h2>

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
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700">
              Template Pesan Otomatis Konfirmasi
            </label>
            <textarea
              rows={6}
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
                "{{paymentPlan}}",
                "{{amountDueNow}}",
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
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#059669]">
                <CheckCircle2 className="h-4 w-4" />
                Semua pengaturan berhasil disimpan!
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
