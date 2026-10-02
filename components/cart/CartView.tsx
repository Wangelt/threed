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
    const addressResult = addressSchema.safeParse(address);
    if (!addressResult.success) {
      setCheckoutError("Selected address is incomplete. Please update it in your profile.");
      return;
    }
    const validAddress = addressResult.data;

    setIsCheckingOut(true);
    setCheckoutError("");

    try {
      const createdOrderResponse = (await api.orders.create({
        paymentMethod: "razorpay",
        shippingAddress: {
          fullName: validAddress.fullName,
          phone: validAddress.phone,
          line1: validAddress.line1,
          line2: validAddress.line2 ?? "",
          city: validAddress.city,
          state: validAddress.state,
          pincode: validAddress.pincode,
        },
      })) as { order?: { _id?: string; orderId?: string } };

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
          name: userName || validAddress.fullName,
          email: userEmail || "",
          contact: validAddress.phone,
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
          className="border-t border-transparent bg-white px-4 py-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] sm:px-6 lg:px-8"
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
        <button type="button" className="p-2" aria-label="Delete">
          <Trash2 size={22} className="text-black" />
        </button>
      </motion.header>

      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="py-12 text-center text-text-secondary"
          >
            Your cart is empty
          </motion.p>
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

                <div className="flex shrink-0 items-center gap-2">
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
        className="border-t border-transparent bg-white px-4 py-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] sm:px-6 lg:px-8"
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
