import type { OrderModel } from "@/lib/data/mock-orders";
import { OrderStatus } from "@/lib/data/mock-orders";

export interface ApiOrderRecord {
  _id?: string;
  orderId?: string;
  orderStatus?: string;
  createdAt?: string;
  subtotal?: number;
  shippingCost?: number;
  paymentMethod?: string;
  shippingAddress?: { line1?: string; line2?: string; city?: string; state?: string; pincode?: string };
  trackingNumber?: string;
  items?: { product?: string; title?: string; image?: string; price?: number; quantity?: number }[];
}

export function toOrderModel(source: ApiOrderRecord): OrderModel {
  const status = source.orderStatus === "shipped" ? OrderStatus.Shipped
    : source.orderStatus === "delivered" ? OrderStatus.Delivered
      : source.orderStatus === "refunded" || source.orderStatus === "cancelled" ? OrderStatus.Returned
        : OrderStatus.Paid;
  const date = source.createdAt ? new Date(source.createdAt) : new Date();
  const address = source.shippingAddress;
  return {
    id: source.orderId || source._id || "",
    status,
    date: date.toLocaleDateString("en-IN", { dateStyle: "medium" }),
    time: date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    subtotal: source.subtotal || 0,
    tax: 0,
    shipping: source.shippingCost || 0,
    paymentMethod: source.paymentMethod || "Online",
    cardLast4: "",
    shippingAddress: [address?.line1, address?.line2, address?.city, address?.state, address?.pincode].filter(Boolean).join(", "),
    billingAddress: "",
    trackingCode: source.trackingNumber || "",
    shippingStep: status === OrderStatus.Delivered ? 3 : status === OrderStatus.Shipped ? 2 : 1,
    items: (source.items || []).map((item) => ({
      productId: String(item.product || ""), name: item.title || "Product",
      image: item.image || "/images/p1.jpg", price: `₹${(item.price || 0).toLocaleString("en-IN")}`,
      quantity: item.quantity || 1,
    })),
  };
}