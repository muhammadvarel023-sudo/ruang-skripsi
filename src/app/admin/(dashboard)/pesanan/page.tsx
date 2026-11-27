import { prisma } from "@/lib/prisma";
import { OrdersClient } from "@/components/admin/OrdersClient";
import type { OrderDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const rows = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });

  const orders: OrderDTO[] = rows.map((o) => ({
    ...o,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  }));

  return <OrdersClient initialOrders={orders} />;
}
