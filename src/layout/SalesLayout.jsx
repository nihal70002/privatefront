import { Outlet } from "react-router-dom";
import SalesSidebar from "../pages/sales/SalesSidebar"; // Adjust this path to where your sidebar file actually lives

export default function SalesLayout() {
  return (
    <div className="flex flex-row min-h-screen bg-gray-50">
      {/* Sidebar - Fixed on the Left */}
      <SalesSidebar />

      {/* Main Content Area - Scrollable on the Right */}
      <main className="flex-1 h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}