import { Route } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./Dashboard";
import PendingOrders from "./PendingOrders";
import Inventory from "./Inventory";
import LowStock from "./LowStock";
import StockMovements from "./StockMovements";
import Profile from "./Profile";

import AllOrders from "./AllOrders";
import WarehouseProcessOrders from "./WarehouseProcessOrders";
import WarehouseOrderDetails from "./WarehouseOrderDetails";
import TodayOrders from "./TodayOrders"; // ✅ ADD THIS

const WarehouseRoutes = (
  <Route path="/warehouse" element={<Layout />}>
    {/* ================= DASHBOARD ================= */}
    <Route index element={<Dashboard />} />
    <Route path="dashboard" element={<Dashboard />} />

    {/* ================= ORDERS ================= */}
    <Route path="orders/today" element={<TodayOrders />} /> {/* ✅ NEW */}
    <Route path="orders/process" element={<WarehouseProcessOrders />} />
    <Route path="orders/pending" element={<PendingOrders />} />
    <Route path="orders/all" element={<AllOrders />} />

    {/* ⚠️ DETAILS MUST BE LAST */}
    <Route path="orders/:orderId" element={<WarehouseOrderDetails />} />

    {/* ================= INVENTORY ================= */}
    <Route path="inventory" element={<Inventory />} />
    <Route path="inventory/low-stock" element={<LowStock />} />
    <Route path="inventory/stock-movements" element={<StockMovements />} />

    {/* ================= PROFILE ================= */}
    <Route path="profile" element={<Profile />} />
  </Route>
);

export default WarehouseRoutes;
