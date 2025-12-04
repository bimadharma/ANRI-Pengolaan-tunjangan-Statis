"use client"

import { useState, useEffect } from "react"
import { Users, Activity, DollarSign, TrendingUp, Loader2, ArrowUpRight, ArrowDownRight, MoreVertical } from "lucide-react"
import Pagination from "../../components/pagination"

// --- TIPE DATA ---
type UserData = {
  id: number
  name: string
  email: string
  status: string
  joined: string
}

type ColorKey = "blue" | "green" | "purple" | "orange"

// --- SIMULASI DATABASE ---
const FAKE_DB_USERS = Array.from({ length: 500 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  status: i % 3 === 0 ? "Inactive" : "Active",
  joined: `${Math.floor(Math.random() * 30) + 1} days ago`,
}))

const fakeFetchUsersAPI = (page: number, limit: number): Promise<{ data: UserData[], meta: any }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      resolve({
        data: FAKE_DB_USERS.slice(startIndex, endIndex),
        meta: {
          totalPages: Math.ceil(FAKE_DB_USERS.length / limit),
          totalItems: FAKE_DB_USERS.length
        }
      })
    }, 600)
  })
}

// --- KOMPONEN ---
export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState(1)
  const [dataUsers, setDataUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [paginationInfo, setPaginationInfo] = useState({ totalPages: 1, totalItems: 0 })
  const itemsPerPage = 5

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const result = await fakeFetchUsersAPI(currentPage, itemsPerPage)
        setDataUsers(result.data)
        setPaginationInfo({
          totalPages: result.meta.totalPages,
          totalItems: result.meta.totalItems,
        })
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [currentPage])

  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  }
  const getColorClasses = (color: ColorKey) => colors[color]

  const stats = [
    { title: "Total Users", value: "2,543", change: "+12.5%", trend: "up", icon: Users, color: "blue" as ColorKey },
    { title: "Active Sessions", value: "847", change: "+8.2%", trend: "up", icon: Activity, color: "green" as ColorKey },
    { title: "Monthly Revenue", value: "$45,231", change: "+23.1%", trend: "up", icon: DollarSign, color: "purple" as ColorKey },
    { title: "Conversion Rate", value: "3.24%", change: "-2.4%", trend: "down", icon: TrendingUp, color: "orange" as ColorKey },
  ]

  return (
    <div className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           {stats.map((stat, i) => (
             <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
               <div className="flex justify-between items-start">
                 <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center mt-2">
                        {stat.trend === "up" ? <ArrowUpRight className="w-4 h-4 text-green-500" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />}
                        <span className={`text-sm font-medium ml-1 ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>{stat.change}</span>
                    </div>
                 </div>
                 <div className={`p-3 rounded-xl ${getColorClasses(stat.color)}`}>
                   <stat.icon className="w-6 h-6"/>
                 </div>
               </div>
             </div>
           ))}
        </div>

        {/* GRAFIK & QUICK STATS (DIKEMBALIKAN KE KODE AWAL) */}
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
                    <div><p className="text-blue-100 text-sm">Daily Users</p><p className="text-3xl font-bold">1,234</p></div>
                    <div><p className="text-blue-100 text-sm">Avg Duration</p><p className="text-3xl font-bold">8m 42s</p></div>
                    <div><p className="text-blue-100 text-sm">Bounce Rate</p><p className="text-3xl font-bold">42.3%</p></div>
                </div>
            </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Recent Users</h2>
            {loading && <span className="text-sm text-blue-500 flex items-center gap-1"><Loader2 className="w-4 h-4 animate-spin"/> Updating...</span>}
          </div>

          <div className="overflow-x-auto min-h-[300px]">
            {loading && dataUsers.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-64 text-gray-400 gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <p>Mengambil data...</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {["Name", "Email", "Status", "Joined", "Actions"].map(h => (
                        <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dataUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold shadow-sm">
                            {user.name.charAt(0)}
                          </div>
                          <span className="ml-3 font-medium text-gray-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.status === "Active" ? "bg-green-100 text-green-700 border border-green-200" : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.joined}</td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={paginationInfo.totalPages}
            totalItems={paginationInfo.totalItems}
            startIndex={(currentPage - 1) * itemsPerPage}
            endIndex={Math.min((currentPage - 1) * itemsPerPage + itemsPerPage, paginationInfo.totalItems)}
            onPageChange={setCurrentPage}
            onPrevious={() => setCurrentPage((p) => Math.max(1, p - 1))}
            onNext={() => setCurrentPage((p) => Math.min(paginationInfo.totalPages, p + 1))}
          />
        </div>
      </div>
    </div>
  )
}