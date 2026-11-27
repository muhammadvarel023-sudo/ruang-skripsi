export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateOrderCode(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `RS-${yy}${mm}-${rand}`;
}

export function parseOutputs(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item): item is string => typeof item === "string" && item.trim().length > 0
      );
    }
    return [];
  } catch {
    return [];
  }
}

export function normalizeWhatsAppNumber(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("0")) {
    return "62" + digits.slice(1);
  }
  if (digits.startsWith("8")) {
    return "62" + digits;
  }
  return digits;
}

export function buildWhatsAppUrl(
  adminPhone: string,
  template: string,
  vars: {
    orderCode: string;
    studentName: string;
    campusName: string;
    major: string;
    categoryName: string;
    packageName: string;
    price: number;
    researchType: string;
    topicOrTitle: string;
  }
): string {
  const phone = normalizeWhatsAppNumber(adminPhone || "6281234567890");
  const message = template
    .replaceAll("{{orderCode}}", vars.orderCode)
    .replaceAll("{{studentName}}", vars.studentName)
    .replaceAll("{{campusName}}", vars.campusName)
    .replaceAll("{{major}}", vars.major)
    .replaceAll("{{categoryName}}", vars.categoryName)
    .replaceAll("{{packageName}}", vars.packageName)
    .replaceAll("{{price}}", formatRupiah(vars.price))
    .replaceAll("{{researchType}}", vars.researchType)
    .replaceAll("{{topicOrTitle}}", vars.topicOrTitle);

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export const ORDER_STATUS_META: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  PENDING: {
    label: "Pending",
    bg: "bg-stone-100 border-stone-200",
    text: "text-stone-700",
    dot: "bg-stone-400",
  },
  WAITING_CONFIRMATION: {
    label: "Menunggu Konfirmasi",
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-800",
    dot: "bg-amber-500",
  },
  IN_PROGRESS: {
    label: "Sedang Berlangsung",
    bg: "bg-sky-50 border-sky-200",
    text: "text-sky-800",
    dot: "bg-sky-500",
  },
  COMPLETED: {
    label: "Selesai",
    bg: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-800",
    dot: "bg-emerald-500",
  },
  CANCELLED: {
    label: "Dibatalkan",
    bg: "bg-rose-50 border-rose-200",
    text: "text-rose-800",
    dot: "bg-rose-500",
  },
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
