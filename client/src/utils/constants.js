// ── Payment Methods ─────────────────────────────────────
export const PAYMENT_METHODS = [
  {
    value: 'cod',
    label: 'Thanh toán khi nhận hàng',
    sub: 'Thanh toán bằng tiền mặt khi giao hàng',
    icon: '💵',
  },
  {
    value: 'qr_code',
    label: 'Chuyển khoản QR (VietQR)',
    sub: 'Quét mã QR để chuyển khoản nhanh 24/7',
    icon: '📸',
  },
];

// ── Filter Options ──────────────────────────────────────
export const TIERS = ['Elite', 'Pro', 'Academy'];
export const SURFACE_TYPES = ['FG', 'AG', 'TF', 'IC', 'SG'];
export const CATEGORIES = ['Phantom', 'Mercurial', 'Tiempo', 'Vapor', 'Other'];

export const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Mới nhất' },
  { value: 'price', label: 'Giá tăng dần' },
  { value: '-price', label: 'Giá giảm dần' },
  { value: '-rating', label: 'Đánh giá cao' },
];

export const SURFACE_LABELS = {
  FG: 'FG — Sân cỏ tự nhiên',
  AG: 'AG — Sân nhân tạo',
  TF: 'TF — Sân cứng',
  IC: 'IC — Trong nhà',
  SG: 'SG — Sân mềm',
};

// ── Admin Status Colors ─────────────────────────────────
export const STATUS_COLORS = {
  pending: { label: 'Chờ xác nhận', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.2)', color: '#fbbf24' },
  confirmed: { label: 'Đã xác nhận', bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.2)', color: '#a78bfa' },
  shipping: { label: 'Đang giao', bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.2)', color: '#f472b6' },
  delivered: { label: 'Đã giao', bg: 'rgba(13,148,136,0.12)', border: 'rgba(13,148,136,0.2)', color: '#2dd4bf' },
  cancelled: { label: 'Đã hủy', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.2)', color: '#f87171' },
};

// ── API Endpoints ───────────────────────────────────────
export const API_PROVINCES = 'https://provinces.open-api.vn/api';

// ── Shipping ────────────────────────────────────────────
export const FREE_SHIPPING_THRESHOLD = 1_500_000;
export const SHIPPING_FEE = 30_000;
