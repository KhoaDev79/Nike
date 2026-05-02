import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// ── Layout Components ───────────────────────────────────
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// ── Public Pages ────────────────────────────────────────
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetail from './pages/ProductDetail';
import AuthPage from './pages/AuthPage';
import SSOCallback from './pages/SSOCallback';
import CheckoutPage from './pages/CheckoutPage';
import AboutPage from './pages/AboutPage';
import WishlistPage from './pages/WishlistPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';

// ── Admin Pages ─────────────────────────────────────────
import AdminDashboard from './admin/pages/DashboardPage';
import AdminOrdersPage from './admin/pages/OrdersPage';
import AdminProductsPage from './admin/pages/ProductsPage';
import AdminCustomersPage from './admin/pages/CustomersPage';
import AdminReportsPage from './admin/pages/ReportsPage';

function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Header />}
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<HomePage />} />
          <Route path='/shop' element={<ShopPage />} />
          <Route path='/product/:slug' element={<ProductDetail />} />
          <Route path='/sso-callback' element={<SSOCallback />} />
          <Route path='/auth' element={<AuthPage />} />
          <Route path='/checkout' element={<CheckoutPage />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/wishlist' element={<WishlistPage />} />
          <Route path='/account' element={<ProfilePage />} />
          <Route path='/orders' element={<OrdersPage />} />
          <Route path='/orders/:id' element={<OrderDetailPage />} />

          {/* Admin Routes */}
          <Route path='/admin/dashboard' element={<AdminDashboard />} />
          <Route path='/admin/orders' element={<AdminOrdersPage />} />
          <Route path='/admin/products' element={<AdminProductsPage />} />
          <Route path='/admin/customers' element={<AdminCustomersPage />} />
          <Route path='/admin/reports' element={<AdminReportsPage />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position='top-right' />
      <Layout />
    </BrowserRouter>
  );
}
