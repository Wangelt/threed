"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CreditCard, Download, Star } from "lucide-react";
import type { OrderModel } from "@/lib/data/mock-orders";
import { MockOrders, OrderStatus, orderStatusLabel, orderTotal } from "@/lib/data/mock-orders";
import { StatusPill } from "@/components/order/StatusPill";
import { ShippingProgressBar } from "@/components/order/ShippingProgressBar";
import { SectionCard } from "@/components/order/SectionCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SafeImage } from "@/components/ui/SafeImage";
import { api } from "@/lib/api";
import { toOrderModel } from "@/lib/order-model";

interface OrderSummaryViewProps {
  order?: OrderModel;
  orderId?: string;
}

function OrderSummaryContent({ order: initialOrder, orderId }: OrderSummaryViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showRate = searchParams.get("rate") === "true";
  const [rating, setRating] = useState(0);
  const [order, setOrder] = useState(initialOrder);

  useEffect(() => {
    if (!initialOrder && orderId) {
      api.orders.byId(orderId).then((result) => {
        const record = (result as { order: unknown }).order;
        setOrder(toOrderModel(record as Parameters<typeof toOrderModel>[0]));
      }).catch(() => router.replace("/orders"));
    }
  }, [initialOrder, orderId, router]);

  const basePath = order ? `/orders/${encodeURIComponent(order.id)}` : "";

  useEffect(() => {
    if (order && searchParams.get("track") === "true") {
      router.replace(`${basePath}/track`);
    }
  }, [order, searchParams, router, basePath]);

  function downloadInvoice() {
    if (!order) return;

    const total = orderTotal(order).toFixed(2);
    const itemSubtotal = order.items.reduce((sum, item) => {
      const price = Number(item.price.replace(/[^0-9.]/g, "")) || 0;
      return sum + price * item.quantity;
    }, 0);
    const shipping = order.shipping;
    const itemRows = order.items.map((item) => `
      <tr><td><strong>${escapeHtml(item.name)}</strong><small>Threedus product</small></td>
        <td>${item.quantity}</td><td>${escapeHtml(item.price)}</td>
        <td>₹${(Number(item.price.replace(/[^0-9.]/g, "")) * item.quantity).toLocaleString("en-IN")}</td>
      </tr>
    `).join("");
    const invoiceHtml = `<!doctype html>
<html><head><meta charset="utf-8"><title>Threedus Invoice ${escapeHtml(order.id)}</title>
<style>
*{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;color:#171717;background:#f4f4f2;margin:0;padding:32px 18px}.sheet{max-width:820px;margin:0 auto;background:#fff;padding:42px 48px;box-shadow:0 8px 30px #00000012}.top{display:flex;justify-content:space-between;gap:30px;border-bottom:1px solid #d9d9d4;padding-bottom:28px}.brand{font-size:30px;font-weight:800;letter-spacing:.5px}.muted{color:#73736d;font-size:12px;line-height:1.6}.label{font-size:10px;letter-spacing:1.3px;text-transform:uppercase;color:#777;font-weight:700;margin-bottom:7px}.invoice-meta{text-align:right}.invoice-meta strong{font-size:18px}.status{display:inline-block;margin-top:10px;background:#edf6ee;color:#26713a;border-radius:20px;padding:6px 11px;font-size:11px;font-weight:700}.parties{display:grid;grid-template-columns:1fr 1fr;gap:40px;padding:26px 0}.party p{margin:3px 0}.items{width:100%;border-collapse:collapse;margin-top:4px}.items th{text-align:left;background:#f5f5f1;color:#666;font-size:10px;letter-spacing:1px;text-transform:uppercase;padding:12px}.items td{border-bottom:1px solid #e6e6e1;padding:15px 12px;font-size:13px;vertical-align:top}.items th:nth-child(n+2),.items td:nth-child(n+2){text-align:right}.items small{display:block;color:#888;margin-top:4px;font-size:11px}.bottom{display:grid;grid-template-columns:1fr 280px;gap:50px;margin-top:28px}.summary{font-size:13px}.summary div{display:flex;justify-content:space-between;padding:7px 0}.summary .grand{border-top:2px solid #171717;margin-top:7px;padding-top:14px;font-size:20px;font-weight:800}.note{border-top:1px solid #ddd;margin-top:36px;padding-top:18px}.footer{text-align:center;border-top:1px solid #ddd;margin-top:30px;padding-top:18px}@media(max-width:600px){body{padding:0}.sheet{padding:28px 20px}.top{display:block}.invoice-meta{text-align:left;margin-top:22px}.parties,.bottom{grid-template-columns:1fr;gap:22px}.items{font-size:11px}.items th,.items td{padding:10px 5px}.items th:nth-child(2),.items td:nth-child(2){display:none}}
@media print{body{background:#fff;padding:0}.sheet{box-shadow:none;max-width:none}}
</style></head><body><main class="sheet">
<header class="top"><div><div class="brand">Threedus</div><div class="muted">Precision-made products for modern spaces</div><div class="muted">Customer invoice</div></div><div class="invoice-meta"><div class="label">Invoice number</div><strong>${escapeHtml(order.id)}</strong><div class="muted">Issued ${escapeHtml(order.date)} · ${escapeHtml(order.time)}</div><span class="status">${escapeHtml(orderStatusLabel(order.status))}</span></div></header>
<section class="parties"><div class="party"><div class="label">From</div><p><strong>Threedus</strong></p><p class="muted">3D printing and product studio</p><p class="muted">India</p></div><div class="party"><div class="label">Ship to</div><p class="muted">${escapeHtml(order.shippingAddress || "Not provided")}</p></div></section>
<table class="items"><thead><tr><th>Item</th><th>Qty</th><th>Unit price</th><th>Amount</th></tr></thead><tbody>${itemRows}</tbody></table>
<section class="bottom"><div><div class="label">Payment details</div><p class="muted">Payment method: <strong>${escapeHtml(order.paymentMethod)}</strong></p><p class="muted">Thank you for shopping with Threedus.</p></div><div class="summary"><div><span>Subtotal</span><span>₹${itemSubtotal.toLocaleString("en-IN")}</span></div><div><span>Shipping</span><span>₹${shipping.toFixed(2)}</span></div><div class="grand"><span>Total</span><span>₹${total}</span></div></div></section>
<div class="note muted">This is a computer-generated invoice and does not require a signature.</div><footer class="footer muted">Threedus · Thank you for your order</footer></main></body></html>`;
    const url = URL.createObjectURL(new Blob([invoiceHtml], { type: "text/html;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${order.id}.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  if (!order) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-white pb-8">
      <header className="flex items-center gap-2 border-b border-border px-2 py-3">
        <button type="button" onClick={() => router.back()} className="p-2">
          <ArrowLeft size={22} />
        </button>
        <h1 className="flex-1 text-center text-[17px] font-semibold pr-10">Orders Summary</h1>
      </header>

      <div className="space-y-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">{order.id}</span>
          <StatusPill label={orderStatusLabel(order.status)} />
        </div>
        <p className="text-xs text-text-secondary">
          {order.date} · {order.time}
        </p>

        <button
          type="button"
          onClick={downloadInvoice}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-semibold"
        >
          <Download size={18} />
          Download Invoice
        </button>

        {order.items.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {order.items.map((item) => (
              <button
                key={item.productId}
                type="button"
                onClick={() => router.push(`${basePath}/items/${item.productId}`)}
                className="relative h-40 w-40 shrink-0 overflow-hidden rounded-[14px]"
              >
                <SafeImage src={item.image} alt={item.name} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}

        {order.items.map((item) => (
          <button
            key={item.productId}
            type="button"
            onClick={() => router.push(`${basePath}/items/${item.productId}`)}
            className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left"
          >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
              <SafeImage src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-text-secondary">Qty: {item.quantity}</p>
            </div>
            <span className="font-bold">{item.price}</span>
          </button>
        ))}

        {(order.status === OrderStatus.Shipped || order.status === OrderStatus.Delivered) && (
          <>
            <ShippingProgressBar currentStep={order.shippingStep} steps={MockOrders.shippingSteps} />
            <PrimaryButton label="Track Package" onClick={() => router.push(`${basePath}/track`)} />
          </>
        )}

        {(order.status === OrderStatus.Delivered || showRate) && (
          <SectionCard title="Rate Product">
            <div className="flex justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button key={i} type="button" onClick={() => setRating(i + 1)}>
                  <Star
                    size={32}
                    className={i < rating ? "fill-black text-black" : "text-border"}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="mt-2 text-center text-[13px] text-text-secondary">
                You rated {rating} / 5
              </p>
            )}
          </SectionCard>
        )}

        <SectionCard title="Payment Information">
          <div className="flex items-center gap-2">
            <CreditCard size={20} />
            <span className="text-sm">
              {order.paymentMethod} ···· {order.cardLast4}
            </span>
          </div>
          <div className="mt-3 space-y-1.5 text-[13px]">
            <Row label="Subtotal" value={`₹${order.subtotal.toFixed(0)}`} />
            <Row label="Tax" value={`₹${order.tax.toFixed(0)}`} />
            <Row label="Shipping Fee" value={`₹${order.shipping.toFixed(0)}`} />
            <div className="my-2 h-px bg-border" />
            <Row label="Total" value={`₹${orderTotal(order).toFixed(0)}`} bold />
          </div>
        </SectionCard>

        <SectionCard title="Shipping Address">
          <p className="whitespace-pre-line text-[13px] leading-[1.5] text-text-secondary">
            {order.shippingAddress}
          </p>
        </SectionCard>

        <SectionCard title="Billing Address">
          <p className="whitespace-pre-line text-[13px] leading-[1.5] text-text-secondary">
            {order.billingAddress}
          </p>
        </SectionCard>

        {order.status === OrderStatus.Paid && (
          <PrimaryButton label="Cancel Order" onClick={() => router.push(`${basePath}/cancel`)} />
        )}
        {order.status === OrderStatus.Delivered && (
          <PrimaryButton label="Request Refund" onClick={() => router.push(`${basePath}/refund`)} />
        )}
        {order.status === OrderStatus.Returned && (
          <button type="button" className="w-full rounded-xl border border-border py-3.5 font-semibold">
            Messages
          </button>
        )}
      </div>
    </div>
  );
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] || character);
}

function Row({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={bold ? "font-bold text-text-primary" : "text-text-secondary"}>{label}</span>
      <span className={bold ? "font-bold" : "font-medium"}>{value}</span>
    </div>
  );
}

export function OrderSummaryView({ order, orderId }: OrderSummaryViewProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <OrderSummaryContent order={order} orderId={orderId} />
    </Suspense>
  );
}
