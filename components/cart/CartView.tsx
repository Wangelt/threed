"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Minus, Plus, Trash2, ArrowRight, MapPin } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  toggleSelected,
  incrementQuantity,
  decrementQuantity,
  removeItem,
  selectCartTotal,
  replaceItems,
  clearItems,
} from "@/store/slices/cartSlice";
import { api } from "@/lib/api";
import { ProductImage } from "@/components/product/ProductImage";
import { fadeUp, stagger, viewport } from "@/lib/motion";
import { addressSchema } from "@/lib/schemas";

function isAuthError(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === "object" &&
      "status" in error &&
      Number((error as { status?: number }).status) === 401,
  );
}

interface SavedAddress {
  _id?: string;
  label?: string;
  fullName?: string;
  phone?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  isDefault?: boolean;
}

interface CartViewProps {
  showBack?: boolean;
  onBack?: () => void;
}

type CheckoutStep = "cart" | "select-address";

export function CartView({ showBack = false, onBack }: CartViewProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const items = useAppSelector((s) => s.cart.items);
  const total = useAppSelector(selectCartTotal);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressIdx, setSelectedAddressIdx] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (items.length > 0) {
      return;
    }

    let isMounted = true;

    async function loadCart() {
      try {
        await api.auth.me();
      } catch (error) {
        if (isMounted && isAuthError(error)) {
          router.replace("/auth?redirect=/cart");
          return;
        }
      }

      try {
        const result = await api.cart.get();
        if (!isMounted || items.length > 0) return;

        const cartItems = result as {
          items?: Array<{
            _id?: string;
            product?: {
              _id?: string;
              slug?: string;
              title?: string;
              images?: string[];
              variants?: Array<{ price?: number; material?: string; color?: string }>;
            };
            quantity?: number;
            priceAtAdd?: number;
          }>;
        };

        dispatch(replaceItems((cartItems.items || []).map((item) => {
          const product = item.product;
          const variant = product?.variants?.[0];
          const image = product?.images?.[0] || "/images/p1.jpg";
          return {
            itemId: item._id,
            selected: true,
            quantity: item.quantity || 1,
            product: {
              id: product?.slug || product?._id || item._id || "",
              name: product?.title || "Product",
              brand: "Threedus",
              price: `₹${(item.priceAtAdd || variant?.price || 0).toLocaleString("en-IN")}`,
              rating: 0,
              reviews: 0,
              description: "",
              image,
              gallery: product?.images?.length ? product.images : [image],
              materials: variant?.material ? [variant.material] : [],
              colors: variant?.color ? [variant.color] : [],
            },
          };
        })));
      } catch (error) {
        if (isMounted && isAuthError(error)) {
          router.replace("/auth?redirect=/cart");
        }
      }
    }

    loadCart();
    return () => {
      isMounted = false;
    };
  }, [dispatch, items.length, router]);

  async function handleRemoveItem(index: number) {
    if (removingIndex !== null) return;
    setRemovingIndex(index);
    const item = items[index];
    try {
      if (item.itemId) {
        await api.cart.remove(item.itemId);
      }
      dispatch(removeItem(index));
    } catch {
      // ignore — still remove locally so the UI doesn't get stuck
      dispatch(removeItem(index));
    } finally {
      setRemovingIndex(null);
    }
  }

  async function handleCheckout() {
    if (total <= 0 || isCheckingOut) return;

    try {
      await api.auth.me();
    } catch (error) {
      if (isAuthError(error)) {
        router.push("/auth?redirect=/cart");
        return;
      }
    }

    try {
      const userResponse = (await api.auth.me()) as {
        user?: {
          name?: string;
          email?: string;
          phone?: string;
          addresses?: SavedAddress[];
        };
      };

      const user = userResponse?.user;
      setUserName(user?.name || "");
      setUserEmail(user?.email || "");

      const userAddresses = user?.addresses || [];
      if (userAddresses.length === 0) {
        router.push("/profile?checkout=address-required");
        return;
      }

      setAddresses(userAddresses);
      const defaultIdx = userAddresses.findIndex((a) => a.isDefault);
      setSelectedAddressIdx(defaultIdx >= 0 ? defaultIdx : 0);
      setCheckoutStep("select-address");
    } catch {
      setCheckoutError("Failed to load your profile. Please try again.");
    }
  }

  async function handleConfirmAddress() {
    const address = addresses[selectedAddressIdx];

    setIsCheckingOut(true);
    setCheckoutError("");

    try {
      // Prefer addressId so the backend uses the exact stored address.
      // Fall back to sending the full address when _id is unavailable.
      const orderBody = address._id
        ? { paymentMethod: "razorpay", addressId: address._id }
        : (() => {
            const normalized = {
              ...address,
              phone: (address.phone || "").replace(/\D/g, "").slice(-10),
              pincode: (address.pincode || "").replace(/\D/g, "").slice(0, 6),
            };
            const result = addressSchema.safeParse(normalized);
            if (!result.success) {
              throw new Error(result.error.issues.map((i) => i.message).join(" · "));
            }
            const v = result.data;
            return {
              paymentMethod: "razorpay",
              shippingAddress: {
                fullName: v.fullName, phone: v.phone,
                line1: v.line1, line2: v.line2 ?? "",
                city: v.city, state: v.state, pincode: v.pincode,
              },
            };
          })();

      const createdOrderResponse = (await api.orders.create(orderBody)) as { order?: { _id?: string; orderId?: string } };

      const order = createdOrderResponse?.order;
      const orderId = order?._id || order?.orderId;
      if (!orderId) {
        throw new Error("Order was created without an id.");
      }

      const paymentPayload = (await api.payments.createOrder(String(orderId))) as {
        keyId?: string;
        razorpayOrderId?: string;
        amount?: number;
        currency?: string;
        orderId?: string;
      };

      if (!paymentPayload.keyId || !paymentPayload.razorpayOrderId) {
        throw new Error("Razorpay order information is missing.");
      }

      const RazorpayCtor = (window as typeof window & { Razorpay?: any }).Razorpay;
      if (!RazorpayCtor) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Razorpay checkout failed to load."));
          document.body.appendChild(script);
        });
      }

      const finalRazorpayCtor = (window as typeof window & { Razorpay?: any }).Razorpay;
      if (!finalRazorpayCtor) {
        throw new Error("Razorpay is not available in this browser.");
      }

      const razorpay = new finalRazorpayCtor({
        key: paymentPayload.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: paymentPayload.amount,
        currency: paymentPayload.currency || "INR",
        name: "3D Forge",
        description: `Payment for order ${paymentPayload.orderId || orderId}`,
        order_id: paymentPayload.razorpayOrderId,
        prefill: {
          name: userName || address.fullName || "",
          email: userEmail || "",
          contact: (address.phone || "").replace(/\D/g, "").slice(-10),
        },
        theme: {
          color: "#000000",
        },
        handler: async function (response: {
          razorpay_payment_id?: string;
          razorpay_order_id?: string;
          razorpay_signature?: string;
        }) {
          await api.payments.verify({
            orderId: String(orderId),
            razorpayOrderId: response.razorpay_order_id || paymentPayload.razorpayOrderId,
            razorpayPaymentId: response.razorpay_payment_id || "",
            razorpaySignature: response.razorpay_signature || "",
          });
          dispatch(clearItems());
          router.push(`/orders/${encodeURIComponent(String(paymentPayload.orderId || orderId))}`);
        },
      });

      razorpay.open();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Checkout failed";
      setCheckoutError(message);
    } finally {
      setIsCheckingOut(false);
    }
  }

  if (checkoutStep === "select-address") {
    return (
      <div className="flex h-full flex-col bg-white">
        <motion.header
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex items-center justify-between border-b border-border px-2 py-3 sm:px-4 lg:px-6"
        >
          <button
            type="button"
            onClick={() => { setCheckoutStep("cart"); setCheckoutError(""); }}
            className="p-2 text-sm text-black"
          >
            ← Back
          </button>
          <h1 className="text-lg font-bold text-black">Delivery Address</h1>
          <div className="w-10" />
        </motion.header>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 lg:px-8">
          <motion.ul
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid gap-3"
          >
            {addresses.map((addr, idx) => (
              <motion.li key={addr._id || idx} variants={fadeUp}>
                <button
                  type="button"
                  onClick={() => setSelectedAddressIdx(idx)}
                  className={`w-full rounded-[14px] border p-4 text-left transition-colors ${
                    selectedAddressIdx === idx
                      ? "border-black bg-black/[0.03]"
                      : "border-border bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        selectedAddressIdx === idx ? "border-black" : "border-border"
                      }`}
                    >
                      {selectedAddressIdx === idx && (
                        <div className="h-2.5 w-2.5 rounded-full bg-black" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="shrink-0 text-text-secondary" />
                        <p className="text-[13px] font-semibold">
                          {addr.label || "Address"}
                          {addr.isDefault && (
                            <span className="ml-2 text-[11px] font-normal text-text-secondary">Default</span>
                          )}
                        </p>
                      </div>
                      <p className="mt-1 text-[13px] leading-[1.5] text-text-secondary">
                        {[addr.fullName, addr.line1, addr.line2, addr.city, addr.state, addr.pincode]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      {addr.phone && (
                        <p className="mt-1 text-xs text-text-secondary">{addr.phone}</p>
                      )}
                    </div>
                  </div>
                </button>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mt-4">
            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="text-sm font-medium text-black underline underline-offset-2"
            >
              + Add a new address
            </button>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={fadeUp}
          className="border-t border-border/60 bg-white px-4 py-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] sm:px-6 lg:px-8"
        >
          {checkoutError ? (
            <p className="mb-3 text-sm text-red-600">{checkoutError}</p>
          ) : null}
          <button
            type="button"
            disabled={isCheckingOut}
            onClick={handleConfirmAddress}
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-7 py-4 font-semibold text-white transition-colors ${
              !isCheckingOut ? "bg-black" : "cursor-not-allowed bg-text-muted"
            }`}
          >
            {isCheckingOut ? "Processing..." : "Pay now"}
            {!isCheckingOut && <ArrowRight size={18} />}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="flex items-center justify-between border-b border-border px-2 py-3 sm:px-4 lg:px-6"
      >
        {showBack ? (
          <button type="button" onClick={onBack} className="p-2 text-sm text-black">
            ← Back
          </button>
        ) : (
          <div className="w-10" />
        )}
        <h1 className="text-lg font-bold text-black">My Cart</h1>
        <div className="w-10" />
      </motion.header>

      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-col items-center gap-4 py-16 text-center"
          >
            <p className="text-text-secondary">Your cart is empty</p>
            <button
              type="button"
              onClick={() => router.push("/search/results?q=All+Products")}
              className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white"
            >
              Start Shopping
            </button>
          </motion.div>
        ) : (
          <motion.ul
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid gap-3 md:grid-cols-2 xl:grid-cols-3"
          >
            {items.map((item, index) => (
              <motion.li
                key={item.product.id}
                variants={fadeUp}
                className={`flex items-center gap-3 rounded-[14px] border p-3 transition-colors duration-250 ${
                  item.selected
                    ? "border-border bg-white"
                    : "border-border/50 bg-surface"
                }`}
              >
                <button
                  type="button"
                  onClick={() => dispatch(toggleSelected(index))}
                  className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md border transition-colors duration-200 ${
                    item.selected
                      ? "border-black bg-black"
                      : "border-border bg-white"
                  }`}
                  aria-label={item.selected ? "Deselect item" : "Select item"}
                >
                  {item.selected && <Check size={14} className="text-white" />}
                </button>

                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[10px]">
                  <ProductImage src={item.product.image} alt={item.product.name} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-text-secondary">{item.product.brand}</p>
                  <p className="truncate text-[13px] font-semibold">{item.product.name}</p>
                  <p className="mt-1 font-bold">{item.product.price}</p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    disabled={removingIndex === index}
                    className="flex h-[22px] w-[22px] items-center justify-center text-text-muted transition-colors hover:text-red-500 disabled:opacity-40"
                    aria-label="Remove item"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="flex items-center gap-2">
                    <QtyButton
                      icon={Minus}
                      onClick={() => dispatch(decrementQuantity(index))}
                    />
                    <span className="min-w-[20px] text-center text-sm">{item.quantity}</span>
                    <QtyButton
                      icon={Plus}
                      onClick={() => dispatch(incrementQuantity(index))}
                    />
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={fadeUp}
        className="border-t border-border/60 bg-white px-4 py-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] sm:px-6 lg:px-8"
      >
        <div className="flex w-full items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-text-secondary">Total</p>
            <p className="text-xl font-extrabold transition-transform duration-300">
              ₹{total.toFixed(0)}
            </p>
          </div>
          <button
            type="button"
            disabled={total <= 0 || isCheckingOut}
            onClick={handleCheckout}
            className={`flex items-center gap-2 rounded-xl px-7 py-4 font-semibold text-white transition-colors ${
              total > 0 && !isCheckingOut ? "bg-black" : "cursor-not-allowed bg-text-muted"
            }`}
          >
            {isCheckingOut ? "Processing..." : "Checkout"}
            {!isCheckingOut && <ArrowRight size={18} />}
          </button>
        </div>

        {checkoutError ? (
          <p className="mt-3 text-sm text-red-600">{checkoutError}</p>
        ) : null}
      </motion.div>
    </div>
  );
}

function QtyButton({
  icon: Icon,
  onClick,
}: {
  icon: typeof Minus;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[26px] w-[26px] items-center justify-center rounded-md border border-border"
    >
      <Icon size={14} />
    </button>
  );
}
