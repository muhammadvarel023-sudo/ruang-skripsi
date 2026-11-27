export type CampusType = "TELKOM_FKS" | "NON_TELKOM";
export type PaymentPlan = "DP_50" | "FULL";

export interface PackageDTO {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  badge: string | null;
  shortDescription: string;
  studentCondition: string;
  outputs: string[];
  price: number;
  discountPrice: number | null;
  durationLabel: string | null;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface CategoryDTO {
  id: string;
  name: string;
  shortLabel: string;
  slug: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  packages: PackageDTO[];
}

export interface OrderDTO {
  id: string;
  orderCode: string;
  packageId: string | null;
  categoryNameSnapshot: string;
  packageNameSnapshot: string;
  priceSnapshot: number;
  paymentPlan: string;
  amountDueNow: number;
  paymentStatus: string;
  campusType: string;
  campusName: string;
  studentName: string;
  major: string;
  whatsapp: string;
  researchType: string;
  topicOrTitle: string;
  notes: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  brand_name: string;
  admin_telegram: string;
  admin_line: string;
  non_telkom_surcharge: number;
  addon_session_price: number;
  qris_image_url: string;
  qris_merchant_name: string;
  bank_name: string;
  bank_account_number: string;
  bank_account_holder: string;
  wa_template: string;
}
