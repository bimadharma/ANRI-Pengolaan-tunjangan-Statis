import { useEffect, useState } from "react";
import { Card, Badge } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";

type Notification = {
  id: number;
  title: string;
  summary: string;
  content: string;
  date: string;
  read?: boolean;
};

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("/data/notifications.json")
      .then((r) => r.json())
      .then((data: Notification[]) => setItems(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Notifikasi</h1>

        {loading ? (
          <p className="text-gray-500">Memuat...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500">Tidak ada notifikasi.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {items.map((n) => (
              <Card
                key={n.id}
                className="
                  rounded-2xl border border-gray-200 cursor-pointer 
                  hover:shadow-xl hover:scale-[1.01] transition-all duration-200
                  bg-white select-none
                "
                onClick={() => navigate(`/notifications/${n.id}`)}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800">
                      {n.title}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(n.date).toLocaleString()}
                    </p>
                  </div>

                  {!n.read && (
                    <Badge color="failure" className="text-[10px] px-2 py-1">
                      Baru
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-slate-700 line-clamp-3">
                  {n.summary}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
