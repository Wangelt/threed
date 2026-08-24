export enum OrderStatus {
  Paid = "paid",
  Shipped = "shipped",
  Delivered = "delivered",
  Returned = "returned",
  Refunded = "refunded",
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: string;
  quantity: number;
}

export interface OrderModel {
  id: string;
  status: OrderStatus;
  items: OrderItem[];
  date: string;
  time: string;
  subtotal: number;
  tax: number;
  shipping: number;
  paymentMethod: string;
  cardLast4: string;
  shippingAddress: string;
  billingAddress: string;
  trackingCode: string;
  shippingStep: number;
}

export function orderTotal(order: OrderModel): number {
  return order.subtotal + order.tax + order.shipping;
}

export function orderStatusLabel(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.Paid:
      return "Paid";
    case OrderStatus.Shipped:
      return "Shipped";
    case OrderStatus.Delivered:
      return "Delivered";
    case OrderStatus.Returned:
      return "Returned";
    case OrderStatus.Refunded:
      return "Refunded";
  }
}

export const MockOrders = {
  cancelReasons: [
    "Change of mind",
    "Found a better price",
    "Wrong item ordered",
    "Delivery taking too long",
    "Other",
  ],

  refundReasons: [
    "Item damaged",
    "Wrong item received",
    "Item not as described",
    "Missing parts",
    "Other",
  ],

  trackingEvents: [
    { title: "Package delivered", location: "Kathmandu, Nepal", date: "Jul 28, 2026", time: "10:30 AM" },
    { title: "Out for delivery", location: "Kathmandu Hub", date: "Jul 28, 2026", time: "08:15 AM" },
    { title: "Arrived at sorting center", location: "Kathmandu Hub", date: "Jul 27, 2026", time: "06:40 PM" },
    { title: "In transit", location: "Regional Facility", date: "Jul 26, 2026", time: "02:20 PM" },
    { title: "Shipped", location: "Threedus Warehouse", date: "Jul 25, 2026", time: "11:00 AM" },
    { title: "Order processed", location: "Threedus Warehouse", date: "Jul 24, 2026", time: "09:30 AM" },
  ],

  shippingSteps: ["Processing", "Shipped", "In Transit", "Delivered"],

  orders: [
    {
      id: "ORD-2026-001",
      status: OrderStatus.Paid,
      date: "Jul 24, 2026",
      time: "09:30 AM",
      subtotal: 9600,
      tax: 480,
      shipping: 200,
      paymentMethod: "Mastercard",
      cardLast4: "4242",
      shippingAddress: "Baneshwor, Kathmandu\nNepal, 44600",
      billingAddress: "Baneshwor, Kathmandu\nNepal, 44600",
      trackingCode: "TRK-8847291034",
      shippingStep: 2,
      items: [
        { productId: "5", name: "G703 Wireless Gaming Mouse", image: "/images/m1.jpg", price: "₹8,000", quantity: 1 },
        { productId: "2", name: "Phone Case", image: "/images/p2.jpg", price: "₹1,600", quantity: 1 },
      ],
    },
    {
      id: "ORD-2026-002",
      status: OrderStatus.Shipped,
      date: "Jul 22, 2026",
      time: "02:15 PM",
      subtotal: 4000,
      tax: 200,
      shipping: 150,
      paymentMethod: "Visa",
      cardLast4: "8891",
      shippingAddress: "Lalitpur, Nepal\n44600",
      billingAddress: "Lalitpur, Nepal\n44600",
      trackingCode: "TRK-8847291034",
      shippingStep: 2,
      items: [
        { productId: "1", name: "3D Printed Model", image: "/images/p1.jpg", price: "₹4,000", quantity: 1 },
      ],
    },
    {
      id: "ORD-2026-003",
      status: OrderStatus.Delivered,
      date: "Jul 18, 2026",
      time: "11:45 AM",
      subtotal: 3500,
      tax: 175,
      shipping: 150,
      paymentMethod: "Mastercard",
      cardLast4: "4242",
      shippingAddress: "Pokhara, Nepal\n33700",
      billingAddress: "Pokhara, Nepal\n33700",
      trackingCode: "TRK-8847291034",
      shippingStep: 3,
      items: [
        { productId: "6", name: "G233 Prodigy Gaming Wired", image: "/images/m2.jpg", price: "₹3,500", quantity: 1 },
      ],
    },
    {
      id: "ORD-2026-004",
      status: OrderStatus.Returned,
      date: "Jul 10, 2026",
      time: "04:20 PM",
      subtotal: 1200,
      tax: 60,
      shipping: 100,
      paymentMethod: "Visa",
      cardLast4: "8891",
      shippingAddress: "Bhaktapur, Nepal\n44800",
      billingAddress: "Bhaktapur, Nepal\n44800",
      trackingCode: "TRK-8847291034",
      shippingStep: 2,
      items: [
        { productId: "4", name: "Mobile Cover", image: "/images/p4.jpg", price: "₹1,200", quantity: 1 },
      ],
    },
  ] satisfies OrderModel[],

  byId(id: string): OrderModel {
    return this.orders.find((o) => o.id === id) ?? this.orders[0];
  },

  byStatus(status: OrderStatus | null): OrderModel[] {
    if (status === null) return this.orders;
    return this.orders.filter((o) => o.status === status);
  },
};
