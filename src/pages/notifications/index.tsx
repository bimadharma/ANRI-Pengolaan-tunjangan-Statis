import { useEffect, useState } from "react";
import { Card, Badge, Button } from "flowbite-react";
import { Link } from "react-router-dom";
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

  useEffect(() => {
    fetch("/data/notifications.json")
      .then((r) => r.json())
      .then((data: Notification[]) => setItems(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout isAdmin={false}>
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Notifikasi</h1>

        {loading ? (
          <p className="text-gray-500">Memuat...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500">Tidak ada notifikasi.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((n) => (
              <Card key={n.id} className="rounded-2xl border border-gray-200">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800">{n.title}</h2>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(n.date).toLocaleString()}
                    </p>
                  </div>
                  {!n.read && <Badge color="failure">Baru</Badge>}
                </div>

                <p className="text-sm text-slate-700 line-clamp-3">{n.summary}</p>

                <div className="flex justify-end">
                  <Link to={`/notifications/${n.id}`}>
                    <Button color="blue" size="sm" className="rounded-xl">
                      Buka
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}