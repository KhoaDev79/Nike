# 📐 Nike Football Client — Project Rules

> Tài liệu quy tắc kiến trúc dự án. Mọi code mới **BẮT BUỘC** tuân theo các quy tắc này.
> Cập nhật lần cuối: 2026-05-02

---

## 1. Cấu trúc thư mục

```
src/
├── api/                  ← Data fetching (Axios)
├── admin/                ← Admin app (tách riêng)
│   ├── pages/
│   └── components/
├── assets/               ← Hình ảnh, font, icon
├── components/           ← UI components tái sử dụng
│   └── layout/           ← Header, Footer, CartDrawer...
├── hooks/                ← Custom hooks (logic nghiệp vụ)
├── pages/                ← Public pages
├── store/                ← Zustand state management
└── utils/                ← Hàm tiện ích + constants
```

### Quy tắc đặt file:

| Loại file | Đặt ở đâu | Ví dụ |
|-----------|-----------|-------|
| API call (Axios) | `api/` | `productApi.js` |
| Shared UI component | `components/` | `ProductCard.jsx` |
| Layout component (Header, Footer...) | `components/layout/` | `SearchBar.jsx` |
| Custom hook | `hooks/` | `useSearch.js` |
| Public page | `pages/` | `ShopPage.jsx` |
| Admin page | `admin/pages/` | `DashboardPage.jsx` |
| Admin-only component | `admin/components/` | `AdminSidebar.jsx` |
| Zustand store | `store/` | `useCartStore.js` |
| Constants, enums | `utils/constants.js` | `PAYMENT_METHODS` |
| Utility function | `utils/` | `formatCurrency.js` |

---

## 2. Quy tắc đặt tên

### Files
- **Components**: `PascalCase.jsx` → `ProductCard.jsx`, `SearchBar.jsx`
- **Hooks**: `camelCase.js` bắt đầu bằng `use` → `useSearch.js`, `useClickOutside.js`
- **API**: `camelCase.js` kết thúc bằng `Api` → `productApi.js`, `authApi.js`
- **Store**: `camelCase.js` bắt đầu bằng `use` + kết thúc `Store` → `useCartStore.js`
- **Utils**: `camelCase.js` → `formatCurrency.js`
- **Pages**: `PascalCase.jsx` kết thúc bằng `Page` → `ShopPage.jsx`, `CheckoutPage.jsx`

### Biến & Functions
- **Component**: `PascalCase` → `export default function ProductCard()`
- **Hook**: `camelCase` bắt đầu `use` → `export default function useSearch()`
- **API function**: `camelCase` kết thúc `API` → `export const getProductsAPI = ...`
- **Constants**: `SCREAMING_SNAKE_CASE` → `PAYMENT_METHODS`, `STATUS_COLORS`

---

## 3. Nguyên tắc kiến trúc

### 3.1 Tách biệt Logic và UI (Separation of Concerns)
```
❌ SAI — Logic trong component
function ShopPage() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios.get('/api/products').then(res => setProducts(res.data));
  }, []);
}

✅ ĐÚNG — Logic trong hook, API trong api/
// api/productApi.js
export const getProductsAPI = (params) => api.get('/products', { params });

// hooks/useProducts.js
export default function useProducts(params) {
  const [products, setProducts] = useState([]);
  useEffect(() => { getProductsAPI(params).then(...) }, [params]);
  return { products };
}

// pages/ShopPage.jsx — chỉ gọi hook và hiển thị
function ShopPage() {
  const { products } = useProducts({ limit: 20 });
  return <div>{products.map(p => <ProductCard key={p._id} {...p} />)}</div>;
}
```

### 3.2 Admin tách riêng hoàn toàn
- Admin có **layout riêng** (dark theme, sidebar) → đặt trong `admin/`
- Admin **KHÔNG** dùng Header/Footer của public
- Admin pages import từ `../../api/`, `../../store/` (2 cấp lên)
- Shared logic (API calls, stores) vẫn dùng chung

### 3.3 Component không quá 200 dòng
- Nếu component > 200 dòng → **BẮT BUỘC** tách
- Tách thành: sub-components, custom hooks, hoặc utils
- Header đã là ví dụ mẫu: 343 dòng → 8 files

### 3.4 Không Magic Values
```
❌ SAI
if (total > 1500000) { /* free shipping */ }
const methods = [{ value: 'cod', label: 'COD' }];

✅ ĐÚNG — Dùng constants
import { FREE_SHIPPING_THRESHOLD, PAYMENT_METHODS } from '../utils/constants';
if (total > FREE_SHIPPING_THRESHOLD) { /* free shipping */ }
```

### 3.5 API Layer nhất quán
- **Mọi HTTP call** phải qua `api/axiosClient.js`
- Không `import axios from 'axios'` trực tiếp trong component/page
- Mỗi domain có 1 file API: `authApi.js`, `productApi.js`, `orderApi.js`
- Function API kết thúc bằng `API`: `getProductsAPI`, `createOrderAPI`

---

## 4. Tech Stack (không thay đổi)

| Layer | Tool | Ghi chú |
|-------|------|---------|
| Build | **Vite** | Dev server + HMR |
| UI | **React 19** | Functional components only |
| Styling | **TailwindCSS** | Utility-first, không inline style (trừ admin) |
| State | **Zustand** | Persist với localStorage |
| API | **Axios** | Interceptors cho JWT + 401 |
| Routing | **React Router DOM** | BrowserRouter |
| Animation | **Framer Motion** | Chỉ dùng khi cần thiết |
| Toast | **React Hot Toast** | Notifications |
| Auth | **Clerk** (optional) + **JWT custom** | Dual auth support |

---

## 5. Import Order

Thứ tự import trong mỗi file (tách bằng dòng trống):

```jsx
// 1. React & third-party
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// 2. API
import { getProductsAPI } from '../api/productApi';

// 3. Store
import useAuthStore from '../store/useAuthStore';

// 4. Hooks
import useSearch from '../hooks/useSearch';

// 5. Components
import ProductCard from '../components/ProductCard';

// 6. Utils & Constants
import { formatVND } from '../utils/formatCurrency';
import { TIERS, SORT_OPTIONS } from '../utils/constants';

// 7. Assets
import heroImage from '../assets/images/hero.jpg';
```

---

## 6. Khi thêm tính năng mới

### Checklist:
- [ ] API call mới? → Thêm vào file API tương ứng trong `api/`
- [ ] Logic phức tạp? → Tạo custom hook trong `hooks/`
- [ ] UI tái sử dụng? → Tạo component trong `components/`
- [ ] Trang mới public? → Tạo trong `pages/`, thêm route vào `App.jsx`
- [ ] Trang mới admin? → Tạo trong `admin/pages/`, thêm route vào `App.jsx`
- [ ] Constant mới? → Thêm vào `utils/constants.js`
- [ ] State global mới? → Cân nhắc thêm vào store hiện tại hoặc tạo store mới

### Ví dụ: Thêm tính năng "Coupon"
```
1. api/couponApi.js          ← API calls
2. hooks/useCoupon.js        ← Logic apply coupon
3. components/CouponInput.jsx ← UI component
4. pages/CheckoutPage.jsx    ← Import & sử dụng
5. utils/constants.js        ← COUPON_TYPES nếu cần
```

---

## 7. Những điều KHÔNG ĐƯỢC LÀM

| ❌ Không | ✅ Thay bằng |
|----------|-------------|
| Import axios trực tiếp | `import api from '../api/axiosClient'` |
| Logic nghiệp vụ trong JSX | Extract ra custom hook |
| Component > 200 dòng | Tách sub-components |
| Hardcode số/string | Dùng `utils/constants.js` |
| Đặt admin page trong `pages/` | Đặt trong `admin/pages/` |
| CSS inline (public pages) | Dùng Tailwind classes |
| `console.log` trong production | Xóa hoặc dùng `console.error` cho lỗi |
| Default export cho API/utils | Named export: `export const fn = ...` |

---

> **Ghi nhớ**: Khi nghi ngờ, hãy nhìn vào file đã có cùng loại để theo pattern.
> Header → `components/layout/Header.jsx`, API → `api/productApi.js`, Hook → `hooks/useSearch.js`
