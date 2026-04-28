import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetail from './pages/ProductDetail';
import AuthPage from './pages/AuthPage';
import CheckoutPage from './pages/CheckoutPage';
import AboutPage from './pages/AboutPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position='top-right' />
      <Header />
      <main>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/shop' element={<ShopPage />} />
          <Route path='/product/:slug' element={<ProductDetail />} />
          <Route path='/auth' element={<AuthPage />} />
          <Route path='/checkout' element={<CheckoutPage />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/orders' element={<OrdersPage />} />
          <Route path='/orders/:id' element={<OrderDetailPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
