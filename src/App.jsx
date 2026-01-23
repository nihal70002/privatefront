import { Routes, Route } from "react-router-dom";

/* PUBLIC */
import Landing from "./pages/public/Landing";
import Login from "./pages/public/Login";

/* PRODUCTS */
import Products from "./pages/public/Products";
import ProductDetails from "./pages/public/ProductDetails";

/* USER */
import Cart from "./pages/user/Cart";
import MyOrders from "./pages/user/MyOrders";
import OrderDetails from "./pages/user/OrderDetails";
import Profile from "./pages/user/Profile";
import Addresses from "./pages/user/Addresses";
import ChangePassword from "./pages/user/ChangePassword";

/* SALES */
import SalesLayout from "./layout/SalesLayout";
import SalesDashboard from "./pages/sales/SalesDashboard";
import SalesOrders from "./pages/sales/SalesOrders";
import SalesCustomers from "./pages/sales/SalesCustomers";
import CreateCustomer from "./pages/sales/CreateCustomer";
import SalesCustomerDetails from "./pages/sales/SalesCustomerDetails";

/* ADMIN */
import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminLowStock from "./pages/admin/AdminLowStock";
import AdminReports from "./pages/admin/AdminReports";
import AdminCustomers from "./pages/admin/AdminCustomers";
import SalesExecutives from "./pages/admin/SalesExecutives";
import SalesExecutiveDetails from "./pages/admin/SalesExecutiveDetails";
import SalesExecutiveOrders from "./pages/admin/SalesExecutiveOrders";
import SalesExecutiveCustomers from "./pages/admin/SalesExecutiveCustomers";

/* GUARDS */
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRoute from "./components/common/AdminRoute";
import SalesRoute from "./components/common/SalesRoute";

export default function App() {
  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* USER */}
      <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
      <Route path="/products/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
      <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
      <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/profile/addresses" element={<ProtectedRoute><Addresses /></ProtectedRoute>} />
      <Route path="/profile/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />

      {/* SALES EXECUTIVE */}
      <Route element={<SalesRoute><SalesLayout /></SalesRoute>}>
        <Route path="/sales-executive" element={<SalesDashboard />} />
        <Route path="/sales/orders" element={<SalesOrders />} />
        <Route path="/sales/customers" element={<SalesCustomers />} />
        <Route path="/sales/customers/create" element={<CreateCustomer />} />
        <Route path="/sales/customers/:id" element={<SalesCustomerDetails />} />
      </Route>

      {/* ADMIN (🔥 FIXED PROPERLY) */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />

        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:orderId" element={<AdminOrderDetails />} />

        <Route path="products" element={<AdminProducts />} />
        <Route path="low-stock" element={<AdminLowStock />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="customers" element={<AdminCustomers />} />

        <Route path="sales-executives" element={<SalesExecutives />} />
        <Route path="sales-executives/:id" element={<SalesExecutiveDetails />} />
        <Route path="sales-executives/:id/orders" element={<SalesExecutiveOrders />} />
        <Route path="sales-executives/:id/customers" element={<SalesExecutiveCustomers />} />
      </Route>

    </Routes>
  );
}
