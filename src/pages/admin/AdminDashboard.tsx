import { Users, Activity, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, MoreVertical, Search, Bell, User } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";

export default function AdminDashboard() {
  // 👉 Definisikan tipe warna berdasarkan key object colors
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  };

  type ColorKey = keyof typeof colors; // "blue" | "green" | "purple" | "orange"

  // 👉 Perbaiki stats dengan define type
  type Stat = {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
    icon: React.ComponentType<any>;
    color: ColorKey;
  };

  const stats: Stat[] = [
    { title: "Total Users", value: "2,543", change: "+12.5%", trend: "up", icon: Users, color: "blue" },
    { title: "Active Sessions", value: "847", change: "+8.2%", trend: "up", icon: Activity, color: "green" },
    { title: "Monthly Revenue", value: "$45,231", change: "+23.1%", trend: "up", icon: DollarSign, color: "purple" },
    { title: "Conversion Rate", value: "3.24%", change: "-2.4%", trend: "down", icon: TrendingUp, color: "orange" },
  ];

  const recentUsers = [
    { name: "John Doe", email: "john@example.com", status: "Active", joined: "2 hours ago" },
    { name: "Sarah Smith", email: "sarah@example.com", status: "Active", joined: "5 hours ago" },
    { name: "Mike Johnson", email: "mike@example.com", status: "Inactive", joined: "1 day ago" },
    { name: "Emily Brown", email: "emily@example.com", status: "Active", joined: "2 days ago" },
    { name: "David Wilson", email: "david@example.com", status: "Active", joined: "3 days ago" },
  ];

  // 👉 getColorClasses sudah bertipe aman
  const getColorClasses = (color: ColorKey) => {
    return colors[color];
  };

  return (
    <MainLayout>
      <div className="">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        {stat.trend === "up" ? <ArrowUpRight className="w-4 h-4 text-green-500" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />}
                        <span className={`text-sm font-medium ml-1 ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>{stat.change}</span>
                        <span className="text-sm text-gray-500 ml-1">vs last month</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl ${getColorClasses(stat.color)}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chart and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Chart Card */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Revenue Analytics</h2>
                <button className="text-sm text-blue-600 font-medium hover:text-blue-700">View Details</button>
              </div>
              <div className="w-full h-80 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 flex items-end justify-around p-8 gap-2">
                  {[65, 45, 75, 55, 85, 60, 70, 50, 80, 65, 90, 75].map((height, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-blue-500 to-indigo-500 rounded-t-lg transition-all hover:from-blue-600 hover:to-indigo-600" style={{ height: `${height}%` }}></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 shadow-lg text-white">
              <h3 className="text-lg font-semibold mb-6">Quick Stats</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Daily Active Users</p>
                  <p className="text-3xl font-bold">1,234</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm mb-1">Avg. Session Duration</p>
                  <p className="text-3xl font-bold">8m 42s</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm mb-1">Page Views</p>
                  <p className="text-3xl font-bold">45.2K</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Users Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Recent Users</h2>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {recentUsers.map((user, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold">{user.name.charAt(0)}</div>
                          <span className="ml-3 font-medium text-gray-900">{user.name}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{user.status}</span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.joined}</td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
