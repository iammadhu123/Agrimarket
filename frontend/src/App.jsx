import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './index.css';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import FarmerLayout from './layouts/FarmerLayout';
import BuyerLayout from './layouts/BuyerLayout';
import AdminLayout from './layouts/AdminLayout';

// Auth
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import MarketplacePage from './pages/public/MarketplacePage';
import ProductDetailPage from './pages/public/ProductDetailPage';
import ContactPage from './pages/public/ContactPage';
import MarketPricesPage from './pages/public/MarketPricesPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Farmer Pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import FarmerProducts from './pages/farmer/FarmerProducts';
import AddProduct from './pages/farmer/AddProduct';
import EditProduct from './pages/farmer/EditProduct';
import FarmerOrders from './pages/farmer/FarmerOrders';
import FarmerExpenses from './pages/farmer/FarmerExpenses';
import FarmerProfile from './pages/farmer/FarmerProfile';
import FarmerNotifications from './pages/farmer/FarmerNotifications';
import FarmerComplaints from './pages/farmer/FarmerComplaints';

// Buyer Pages
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import CartPage from './pages/buyer/CartPage';
import BuyerOrders from './pages/buyer/BuyerOrders';
import OrderDetail from './pages/buyer/OrderDetail';
import WishlistPage from './pages/buyer/WishlistPage';
import BuyerReviews from './pages/buyer/BuyerReviews';
import BuyerProfile from './pages/buyer/BuyerProfile';
import BuyerNotifications from './pages/buyer/BuyerNotifications';
import BuyerComplaints from './pages/buyer/BuyerComplaints';
import CheckoutPage from './pages/buyer/CheckoutPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCategories from './pages/admin/AdminCategories';
import AdminComplaints from './pages/admin/AdminComplaints';
import AdminMarketPrices from './pages/admin/AdminMarketPrices';
import AdminReports from './pages/admin/AdminReports';
import AdminNotifications from './pages/admin/AdminNotifications';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { borderRadius: '12px', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' },
              success: { iconTheme: { primary: '#16a34a', secondary: 'white' } },
              error: { iconTheme: { primary: '#ef4444', secondary: 'white' } },
            }}
          />
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/marketplace/:id" element={<ProductDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/market-prices" element={<MarketPricesPage />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Farmer Routes */}
            <Route
              path="/farmer"
              element={<ProtectedRoute roles={['farmer']}><FarmerLayout /></ProtectedRoute>}
            >
              <Route index element={<Navigate to="/farmer/dashboard" replace />} />
              <Route path="dashboard" element={<FarmerDashboard />} />
              <Route path="products" element={<FarmerProducts />} />
              <Route path="products/add" element={<AddProduct />} />
              <Route path="products/edit/:id" element={<EditProduct />} />
              <Route path="orders" element={<FarmerOrders />} />
              <Route path="expenses" element={<FarmerExpenses />} />
              <Route path="profile" element={<FarmerProfile />} />
              <Route path="notifications" element={<FarmerNotifications />} />
              <Route path="complaints" element={<FarmerComplaints />} />
            </Route>

            {/* Buyer Routes */}
            <Route
              path="/buyer"
              element={<ProtectedRoute roles={['buyer']}><BuyerLayout /></ProtectedRoute>}
            >
              <Route index element={<Navigate to="/buyer/dashboard" replace />} />
              <Route path="dashboard" element={<BuyerDashboard />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="orders" element={<BuyerOrders />} />
              <Route path="orders/:id" element={<OrderDetail />} />
              <Route path="wishlist" element={<WishlistPage />} />
              <Route path="reviews" element={<BuyerReviews />} />
              <Route path="profile" element={<BuyerProfile />} />
              <Route path="notifications" element={<BuyerNotifications />} />
              <Route path="complaints" element={<BuyerComplaints />} />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={<ProtectedRoute roles={['admin']}><AdminLayout /></ProtectedRoute>}
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="complaints" element={<AdminComplaints />} />
              <Route path="market-prices" element={<AdminMarketPrices />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="notifications" element={<AdminNotifications />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
