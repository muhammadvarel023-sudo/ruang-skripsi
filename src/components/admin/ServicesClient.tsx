"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Loader2,
  FolderPlus,
} from "lucide-react";
import type { CategoryDTO, PackageDTO } from "@/lib/types";
import { formatRupiah } from "@/lib/format";

interface PackageFormState {
  id?: string;
  categoryId: string;
  name: string;
  badge: string;
  shortDescription: string;
  studentCondition: string;
  outputs: string[];
  price: string;
  discountPrice: string;
  durationLabel: string;
  isFeatured: boolean;
  isActive: boolean;
}

export function ServicesClient({
  initialCategories,
}: {
  initialCategories: CategoryDTO[];
}) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryDTO[]>(initialCategories);
  const [selectedCatId, setSelectedCatId] = useState<string>(
    initialCategories[0]?.id ?? ""
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newCatOpen, setNewCatOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatShort, setNewCatShort] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");

  const [form, setForm] = useState<PackageFormState>({
    categoryId: initialCategories[0]?.id ?? "",
    name: "",
    badge: "",
    shortDescription: "",
    studentCondition: "",
    outputs: [""],
    price: "200000",
    discountPrice: "",
    durationLabel: "",
    isFeatured: false,
    isActive: true,
  });

  const activeCategory =
    categories.find((c) => c.id === selectedCatId) ?? categories[0];

  function openCreatePackage() {
    setError(null);
    setForm({
      categoryId: activeCategory?.id ?? categories[0]?.id ?? "",
      name: "",
      badge: "",
      shortDescription: "",
      studentCondition: "",
      outputs: [""],
      price: "200000",
      discountPrice: "",
      durationLabel: "1x Sesi Konsultasi",
      isFeatured: false,
      isActive: true,
    });
    setDrawerOpen(true);
  }

  function openEditPackage(pkg: PackageDTO) {
    setError(null);
    setForm({
      id: pkg.id,
      categoryId: pkg.categoryId,
      name: pkg.name,
      badge: pkg.badge ?? "",
      shortDescription: pkg.shortDescription,
      studentCondition: pkg.studentCondition,
      outputs: pkg.outputs.length > 0 ? [...pkg.outputs] : [""],
      price: String(pkg.price),
      discountPrice: pkg.discountPrice ? String(pkg.discountPrice) : "",
      durationLabel: pkg.durationLabel ?? "",
      isFeatured: pkg.isFeatured,
      isActive: pkg.isActive,
    });
    setDrawerOpen(true);
  }

  async function refreshCatalog() {
    const res = await fetch("/api/categories");
    if (res.ok) {
      const data = await res.json();
      const mapped: CategoryDTO[] = data.categories.map(
        (cat: CategoryDTO & { packages: Array<Omit<PackageDTO, "outputs"> & { outputs: string }> }) => ({
          ...cat,
          packages: cat.packages.map((p) => ({
            ...p,
            outputs: typeof p.outputs === "string" ? JSON.parse(p.outputs || "[]") : p.outputs,
          })),
        })
      );
      setCategories(mapped);
    }
    router.refresh();
  }

  async function handleSavePackage(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      categoryId: form.categoryId,
      name: form.name,
      badge: form.badge || null,
      shortDescription: form.shortDescription,
      studentCondition: form.studentCondition,
      outputs: form.outputs.map((o) => o.trim()).filter(Boolean),
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
      durationLabel: form.durationLabel || null,
      isFeatured: form.isFeatured,
      isActive: form.isActive,
    };

    try {
      const url = form.id ? `/api/packages/${form.id}` : "/api/packages";
      const method = form.id ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal menyimpan paket.");
        return;
      }
      await refreshCatalog();
      setDrawerOpen(false);
    } catch {
      setError("Koneksi gagal. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(pkg: PackageDTO) {
    await fetch(`/api/packages/${pkg.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !pkg.isActive }),
    });
    await refreshCatalog();
  }

  async function handleDeletePackage(pkg: PackageDTO) {
    if (!confirm(`Hapus paket "${pkg.name}"?`)) return;
    await fetch(`/api/packages/${pkg.id}`, { method: "DELETE" });
    await refreshCatalog();
  }

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newCatName,
        shortLabel: newCatShort || newCatName,
        description: newCatDesc,
      }),
    });
    if (res.ok) {
      setNewCatName("");
      setNewCatShort("");
      setNewCatDesc("");
      setNewCatOpen(false);
      await refreshCatalog();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-slate-400">
            Katalog & Harga
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#0F172A]">
            Kelola Layanan & Paket
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Setiap perubahan harga, output, atau status aktif langsung tampil di halaman utama.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setNewCatOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <FolderPlus className="h-3.5 w-3.5" />
            Kategori Baru
          </button>
          <button
            type="button"
            onClick={openCreatePackage}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F172A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E3A5F] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Tambah Paket
          </button>
        </div>
      </div>

      {/* Inline New Category Form */}
      <AnimatePresence>
        {newCatOpen && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreateCategory}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5"
          >
            <p className="text-xs font-semibold text-[#0F172A]">
              Tambah Kategori Layanan Baru (Misal: BAB 4, Bundling, atau Revisi)
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <input
                type="text"
                required
                placeholder="Nama lengkap (cth: Paket Bundling)"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-[#1E3A5F]"
              />
              <input
                type="text"
                placeholder="Label tab (cth: Bundling)"
                value={newCatShort}
                onChange={(e) => setNewCatShort(e.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-[#1E3A5F]"
              />
              <input
                type="text"
                placeholder="Deskripsi singkat kategori"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-[#1E3A5F]"
              />
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setNewCatOpen(false)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#0F172A] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#1E3A5F] cursor-pointer"
              >
                Simpan Kategori
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCatId(cat.id)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
              activeCategory?.id === cat.id
                ? "bg-[#0F172A] text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {cat.name} ({cat.packages.length})
          </button>
        ))}
      </div>

      {/* Packages Grid */}
      {activeCategory && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {activeCategory.packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`flex flex-col justify-between rounded-2xl border bg-white p-5 transition-opacity ${
                pkg.isActive
                  ? "border-slate-200/90"
                  : "border-dashed border-slate-300 opacity-65"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      pkg.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        pkg.isActive ? "bg-emerald-500" : "bg-slate-400"
                      }`}
                    />
                    {pkg.isActive ? "Aktif" : "Nonaktif"}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleActive(pkg)}
                    className="text-[11px] font-semibold text-slate-500 hover:text-[#0F172A] underline cursor-pointer"
                  >
                    {pkg.isActive ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                </div>

                <h3 className="mt-3 text-base font-semibold text-[#0F172A]">
                  {pkg.name}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 line-clamp-2">
                  {pkg.shortDescription}
                </p>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-mono text-lg font-semibold text-[#0F172A] tabular-nums">
                    {formatRupiah(
                      pkg.discountPrice && pkg.discountPrice < pkg.price
                        ? pkg.discountPrice
                        : pkg.price
                    )}
                  </span>
                  {pkg.discountPrice && pkg.discountPrice < pkg.price && (
                    <span className="font-mono text-xs text-slate-400 line-through">
                      {formatRupiah(pkg.price)}
                    </span>
                  )}
                </div>

                <ul className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
                  {pkg.outputs.slice(0, 4).map((out, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-1.5 text-xs text-slate-600"
                    >
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0F766E]" />
                      <span className="line-clamp-1">{out}</span>
                    </li>
                  ))}
                  {pkg.outputs.length > 4 && (
                    <li className="text-[11px] text-slate-400">
                      +{pkg.outputs.length - 4} output lainnya
                    </li>
                  )}
                </ul>
              </div>

              <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => openEditPackage(pkg)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-[#FAF9F6] px-3 py-2 text-xs font-semibold text-[#0F172A] hover:bg-slate-100 cursor-pointer"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit Paket
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePackage(pkg)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                  title="Hapus paket"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Package Add/Edit Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-[2px]"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="relative z-10 flex h-full w-full max-w-lg flex-col bg-[#FAF9F6] shadow-2xl border-l border-slate-200"
            >
              <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
                <h3 className="text-base font-semibold text-[#0F172A]">
                  {form.id ? "Edit Paket Layanan" : "Tambah Paket Baru"}
                </h3>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form
                onSubmit={handleSavePackage}
                className="flex flex-1 flex-col overflow-hidden"
              >
                <div className="flex-1 overflow-y-auto p-6 space-y-4 text-sm">
                  {error && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700">
                      {error}
                    </div>
                  )}

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700">
                        Kategori
                      </label>
                      <select
                        value={form.categoryId}
                        onChange={(e) =>
                          setForm({ ...form, categoryId: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-[#1E3A5F]"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700">
                        Label Badge (Opsional)
                      </label>
                      <input
                        type="text"
                        value={form.badge}
                        onChange={(e) => setForm({ ...form, badge: e.target.value })}
                        placeholder="Cth: Paling Populer"
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-[#1E3A5F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Nama Paket
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Cth: Pengembangan Judul"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#1E3A5F]"
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700">
                        Harga Normal (Rp)
                      </label>
                      <input
                        type="number"
                        required
                        min={0}
                        step={5000}
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm outline-none focus:border-[#1E3A5F]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700">
                        Harga Promo (Opsional)
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={5000}
                        value={form.discountPrice}
                        onChange={(e) =>
                          setForm({ ...form, discountPrice: e.target.value })
                        }
                        placeholder="Kosongkan jika tidak promo"
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm outline-none focus:border-[#1E3A5F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Estimasi Sesi / Durasi (Opsional)
                    </label>
                    <input
                      type="text"
                      value={form.durationLabel}
                      onChange={(e) =>
                        setForm({ ...form, durationLabel: e.target.value })
                      }
                      placeholder="Cth: 2x Sesi Diskusi + Review Draft"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-[#1E3A5F]"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Deskripsi Singkat
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={form.shortDescription}
                      onChange={(e) =>
                        setForm({ ...form, shortDescription: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-[#1E3A5F]"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Kondisi Awal Mahasiswa (&quot;Cocok jika kamu...&quot;)
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={form.studentCondition}
                      onChange={(e) =>
                        setForm({ ...form, studentCondition: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-[#1E3A5F]"
                    />
                  </div>

                  {/* Dynamic Outputs List */}
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700">
                        Daftar Output Layanan
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setForm({ ...form, outputs: [...form.outputs, ""] })
                        }
                        className="text-xs font-semibold text-[#1E3A5F] hover:underline cursor-pointer"
                      >
                        + Tambah Poin
                      </button>
                    </div>
                    <div className="space-y-2">
                      {form.outputs.map((out, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={out}
                            onChange={(e) => {
                              const next = [...form.outputs];
                              next[idx] = e.target.value;
                              setForm({ ...form, outputs: next });
                            }}
                            placeholder={`Poin output ${idx + 1}`}
                            className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-[#1E3A5F]"
                          />
                          {form.outputs.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setForm({
                                  ...form,
                                  outputs: form.outputs.filter((_, i) => i !== idx),
                                })
                              }
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(e) =>
                          setForm({ ...form, isActive: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-slate-300 accent-[#0F172A]"
                      />
                      Tampilkan di Katalog (Aktif)
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.isFeatured}
                        onChange={(e) =>
                          setForm({ ...form, isFeatured: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-slate-300 accent-[#0F172A]"
                      />
                      Sorot Paket (Featured)
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-white px-6 py-4">
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F172A] px-5 py-2 text-xs font-semibold text-white hover:bg-[#1E3A5F] disabled:opacity-60 cursor-pointer"
                  >
                    {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
