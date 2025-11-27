import AdminSidebar from "../../components/AdminSidebar";
import MainLayout from "../../components/layout/MainLayout";

export default function AdminDashboard() {
  return (
    <MainLayout isAdmin={true}>
    <div className="flex bg-gray-50 min-h-screen">

      {/* Sidebar */}
      <div>
        <AdminSidebar />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6">

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* CARD 1 */}
          <div className="rounded-xl p-6 bg-white shadow">
            <h2 className="text-lg font-semibold">Total Users</h2>
            <p className="text-3xl font-bold mt-3">120</p>
          </div>

          {/* CARD 2 */}
          <div className="rounded-xl p-6 bg-white shadow">
            <h2 className="text-lg font-semibold">Active Sessions</h2>
            <p className="text-3xl font-bold mt-3">8</p>
          </div>

          {/* CARD 3 */}
          <div className="rounded-xl p-6 bg-white shadow">
            <h2 className="text-lg font-semibold">Monthly Revenue</h2>
            <p className="text-3xl font-bold mt-3">$3,900</p>
          </div>
        </div>

        {/* CHART SECTION */}
        <div className="mt-8 p-6 bg-white rounded-xl shadow">
          <h1 className="text-xl font-bold mb-4">Analytics Chart</h1>
          <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-600">Chart Placeholder</p>
          </div>
        </div>

      </div>

    </div>
    </MainLayout>
  );
}
