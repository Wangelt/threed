const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

export const API_CONFIG = {
  baseUrl: API_URL,
  endpoints: {
    health: "/health", register: "/auth/register", login: "/auth/login",
    firebasePhoneLogin: "/auth/firebase-phone", me: "/auth/me", refresh: "/auth/refresh",
    forgotPassword: "/auth/forgot-password", resetPassword: "/auth/reset-password",
    verifyEmail: "/auth/verify-email", logout: "/auth/logout", categories: "/categories",
    products: "/products", cart: "/cart", coupons: "/coupons", orders: "/orders",
    payments: "/payments", wishlist: "/wishlist", reviews: "/reviews",
    notifications: "/notifications", customOrders: "/custom-orders", uploads: "/uploads",
    users: "/users", adminUsers: "/admin-users", locations: "/locations", inventory: "/inventory",
  },
} as const;

export interface ApiResponse<T> { success: boolean; message?: string; data: T; }
export interface ApiRequestOptions extends RequestInit {
  token?: string;
  query?: Record<string, string | number | boolean | null | undefined>;
}

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(message: string, status: number, details?: unknown) {
    super(message); this.name = "ApiError"; this.status = status; this.details = details;
  }
}

async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { token, query, headers, body, ...init } = options;
  const url = new URL(`${API_CONFIG.baseUrl}${path}`);
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
  });
  const response = await fetch(url, {
    ...init, body, credentials: "include",
    headers: {
      ...(body && !(body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}), ...headers,
    },
  });
  const payload = (await response.json().catch(() => ({}))) as ApiResponse<T> & { details?: unknown };
  if (!response.ok || payload.success === false) throw new ApiError(payload.message || "Request failed", response.status, payload.details);
  return payload.data as T;
}

const jsonBody = (value: unknown): BodyInit => JSON.stringify(value);

export const api = {
  health: () => request<{ message: string }>(API_CONFIG.endpoints.health),
  auth: {
    register: (body: unknown) => request(API_CONFIG.endpoints.register, { method: "POST", body: jsonBody(body) }),
    login: (body: unknown) => request(API_CONFIG.endpoints.login, { method: "POST", body: jsonBody(body) }),
    firebasePhoneLogin: (idToken: string) => request(API_CONFIG.endpoints.firebasePhoneLogin, { method: "POST", body: jsonBody({ idToken }) }),
    me: (token?: string) => request(API_CONFIG.endpoints.me, { token }),
    refresh: () => request(API_CONFIG.endpoints.refresh, { method: "POST", body: jsonBody({}) }),
    forgotPassword: (email: string) => request(API_CONFIG.endpoints.forgotPassword, { method: "POST", body: jsonBody({ email }) }),
    resetPassword: (body: unknown) => request(API_CONFIG.endpoints.resetPassword, { method: "POST", body: jsonBody(body) }),
    verifyEmail: (token: string) => request(API_CONFIG.endpoints.verifyEmail, { method: "POST", body: jsonBody({ token }) }),
    logout: (token?: string) => request(API_CONFIG.endpoints.logout, { method: "POST", token, body: jsonBody({}) }),
  },
  users: {
    updateAddresses: (body: unknown, token?: string) => request(`${API_CONFIG.endpoints.users}/addresses`, { method: "PUT", token, body: jsonBody(body) }),
    byId: (id: string, token?: string) => request(`${API_CONFIG.endpoints.users}/${id}`, { token }),
  },
  adminUsers: {
    list: (query?: ApiRequestOptions["query"], token?: string) => request(API_CONFIG.endpoints.adminUsers, { query, token }),
    create: (body: unknown, token?: string) => request(API_CONFIG.endpoints.adminUsers, { method: "POST", token, body: jsonBody(body) }),
    update: (id: string, body: unknown, token?: string) => request(`${API_CONFIG.endpoints.adminUsers}/${id}`, { method: "PATCH", token, body: jsonBody(body) }),
    block: (id: string, body: unknown, token?: string) => request(`${API_CONFIG.endpoints.adminUsers}/${id}/block`, { method: "PATCH", token, body: jsonBody(body) }),
  },
  locations: {
    list: (query?: ApiRequestOptions["query"], token?: string) => request(API_CONFIG.endpoints.locations, { query, token }),
    create: (body: unknown, token?: string) => request(API_CONFIG.endpoints.locations, { method: "POST", token, body: jsonBody(body) }),
    update: (id: string, body: unknown, token?: string) => request(`${API_CONFIG.endpoints.locations}/${id}`, { method: "PATCH", token, body: jsonBody(body) }),
  },
  inventory: {
    list: (query?: ApiRequestOptions["query"], token?: string) => request(API_CONFIG.endpoints.inventory, { query, token }),
    set: (body: unknown, token?: string) => request(API_CONFIG.endpoints.inventory, { method: "PATCH", token, body: jsonBody(body) }),
  },
  categories: {
    list: () => request<{ categories: unknown[] }>(API_CONFIG.endpoints.categories),
    create: (body: unknown, token?: string) => request(API_CONFIG.endpoints.categories, { method: "POST", token, body: jsonBody(body) }),
    update: (id: string, body: unknown, token?: string) => request(`${API_CONFIG.endpoints.categories}/${id}`, { method: "PUT", token, body: jsonBody(body) }),
    remove: (id: string, token?: string) => request(`${API_CONFIG.endpoints.categories}/${id}`, { method: "DELETE", token }),
  },
  products: {
    list: (query?: ApiRequestOptions["query"], token?: string) => request<{ products: unknown[]; pagination: unknown }>(API_CONFIG.endpoints.products, { query, token }),
    bySlug: (slug: string, token?: string) => request<{ product: unknown }>(`${API_CONFIG.endpoints.products}/${slug}`, { token }),
    create: (body: unknown, token?: string) => request(API_CONFIG.endpoints.products, { method: "POST", token, body: jsonBody(body) }),
    update: (id: string, body: unknown, token?: string) => request(`${API_CONFIG.endpoints.products}/${id}`, { method: "PUT", token, body: jsonBody(body) }),
    remove: (id: string, token?: string) => request(`${API_CONFIG.endpoints.products}/${id}`, { method: "DELETE", token }),
  },
  cart: {
    get: (token?: string) => request(API_CONFIG.endpoints.cart, { token }),
    add: (body: unknown, token?: string) => request(`${API_CONFIG.endpoints.cart}/add`, { method: "POST", token, body: jsonBody(body) }),
    update: (body: unknown, token?: string) => request(`${API_CONFIG.endpoints.cart}/update`, { method: "PUT", token, body: jsonBody(body) }),
    remove: (itemId: string, token?: string) => request(`${API_CONFIG.endpoints.cart}/remove`, { method: "DELETE", token, body: jsonBody({ itemId }) }),
    applyCoupon: (code: string, token?: string) => request(`${API_CONFIG.endpoints.cart}/apply-coupon`, { method: "POST", token, body: jsonBody({ code }) }),
    removeCoupon: (token?: string) => request(`${API_CONFIG.endpoints.cart}/remove-coupon`, { method: "DELETE", token }),
  },
  coupons: {
    validate: (code: string, token?: string) => request(`${API_CONFIG.endpoints.coupons}/validate`, { method: "POST", token, body: jsonBody({ code }) }),
    list: (token?: string) => request(API_CONFIG.endpoints.coupons, { token }),
    create: (body: unknown, token?: string) => request(API_CONFIG.endpoints.coupons, { method: "POST", token, body: jsonBody(body) }),
    update: (id: string, body: unknown, token?: string) => request(`${API_CONFIG.endpoints.coupons}/${id}`, { method: "PUT", token, body: jsonBody(body) }),
    remove: (id: string, token?: string) => request(`${API_CONFIG.endpoints.coupons}/${id}`, { method: "DELETE", token }),
  },
  wishlist: {
    get: (token?: string) => request(API_CONFIG.endpoints.wishlist, { token }),
    add: (productId: string, token?: string) => request(`${API_CONFIG.endpoints.wishlist}/add`, { method: "POST", token, body: jsonBody({ productId }) }),
    remove: (productId: string, token?: string) => request(`${API_CONFIG.endpoints.wishlist}/remove/${productId}`, { method: "DELETE", token }),
    moveToCart: (body: unknown, token?: string) => request(`${API_CONFIG.endpoints.wishlist}/move-to-cart`, { method: "POST", token, body: jsonBody(body) }),
  },
  orders: {
    create: (body: unknown, token?: string) => request(API_CONFIG.endpoints.orders, { method: "POST", token, body: jsonBody(body) }),
    mine: (query?: ApiRequestOptions["query"], token?: string) => request(`${API_CONFIG.endpoints.orders}/my`, { query, token }),
    byId: (id: string, token?: string) => request(`${API_CONFIG.endpoints.orders}/${id}`, { token }),
    cancel: (id: string, body: unknown, token?: string) => request(`${API_CONFIG.endpoints.orders}/${id}/cancel`, { method: "POST", token, body: jsonBody(body) }),
    adminList: (query?: ApiRequestOptions["query"], token?: string) => request(API_CONFIG.endpoints.orders, { query, token }),
    updateStatus: (id: string, body: unknown, token?: string) => request(`${API_CONFIG.endpoints.orders}/${id}/status`, { method: "PUT", token, body: jsonBody(body) }),
  },
  reviews: {
    listByProduct: (productId: string, query?: ApiRequestOptions["query"]) => request(`${API_CONFIG.endpoints.reviews}/product/${productId}`, { query }),
    create: (body: unknown, token?: string) => request(API_CONFIG.endpoints.reviews, { method: "POST", token, body: jsonBody(body) }),
    update: (id: string, body: unknown, token?: string) => request(`${API_CONFIG.endpoints.reviews}/${id}`, { method: "PUT", token, body: jsonBody(body) }),
    helpful: (id: string, token?: string) => request(`${API_CONFIG.endpoints.reviews}/${id}/helpful`, { method: "POST", token }),
    remove: (id: string, token?: string) => request(`${API_CONFIG.endpoints.reviews}/${id}`, { method: "DELETE", token }),
  },
  notifications: {
    list: (query?: ApiRequestOptions["query"], token?: string) => request(API_CONFIG.endpoints.notifications, { query, token }),
    markRead: (id: string, token?: string) => request(`${API_CONFIG.endpoints.notifications}/${id}/read`, { method: "PUT", token }),
    markAllRead: (token?: string) => request(`${API_CONFIG.endpoints.notifications}/read-all`, { method: "PUT", token }),
    remove: (id: string, token?: string) => request(`${API_CONFIG.endpoints.notifications}/${id}`, { method: "DELETE", token }),
  },
  customOrders: {
    create: (body: unknown, token?: string) => request(API_CONFIG.endpoints.customOrders, { method: "POST", token, body: jsonBody(body) }),
    list: (query?: ApiRequestOptions["query"], token?: string) => request(API_CONFIG.endpoints.customOrders, { query, token }),
    byId: (id: string, token?: string) => request(`${API_CONFIG.endpoints.customOrders}/${id}`, { token }),
    updateStatus: (id: string, body: unknown, token?: string) => request(`${API_CONFIG.endpoints.customOrders}/${id}/status`, { method: "PUT", token, body: jsonBody(body) }),
    acceptQuote: (id: string, token?: string) => request(`${API_CONFIG.endpoints.customOrders}/${id}/accept-quote`, { method: "PUT", token }),
    rejectQuote: (id: string, body: unknown, token?: string) => request(`${API_CONFIG.endpoints.customOrders}/${id}/reject-quote`, { method: "PUT", token, body: jsonBody(body) }),
  },
  payments: {
    createOrder: (orderId: string, token?: string) => request(`${API_CONFIG.endpoints.payments}/create-order`, { method: "POST", token, body: jsonBody({ orderId }) }),
    verify: (body: unknown, token?: string) => request(`${API_CONFIG.endpoints.payments}/verify`, { method: "POST", token, body: jsonBody(body) }),
    webhook: (body: unknown, signature: string) => request(`${API_CONFIG.endpoints.payments}/webhook`, { method: "POST", body: jsonBody(body), headers: { "x-razorpay-signature": signature } }),
  },
  uploads: {
    status: (token?: string) => request(`${API_CONFIG.endpoints.uploads}/status`, { token }),
    image: (formData: FormData, token?: string) => request(`${API_CONFIG.endpoints.uploads}/image`, { method: "POST", token, body: formData }),
    images: (formData: FormData, token?: string) => request(`${API_CONFIG.endpoints.uploads}/images`, { method: "POST", token, body: formData }),
    remove: (publicId: string, token?: string) => request(API_CONFIG.endpoints.uploads, { method: "DELETE", token, body: jsonBody({ publicId }) }),
  },
};