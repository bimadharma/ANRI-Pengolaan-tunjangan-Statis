import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Badge } from "flowbite-react";
import MainLayout from "../../components/layout/MainLayout";

type Notification = {
  id: number;
  title: string;
  summary: string;
  content: string;
  date: string;
  read?: boolean;
};

export default function NotificationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/notifications.json")
      .then((r) => r.json())
      .then((data: Notification[]) => {
        const found = data.find((x) => String(x.id) === id);
        setItem(found || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <MainLayout isAdmin={false}>
      <div className="p-6 max-w-3xl mx-auto">
        {loading ? (
          <p className="text-gray-500">Memuat...</p>
        ) : !item ? (
          <div className="space-y-4">
            <p className="text-gray-500">Notifikasi tidak ditemukan.</p>
            <Link to="/notifications">
              <Button color="light" className="rounded-xl">Kembali</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">{item.title}</h1>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(item.date).toLocaleString()}
                </p>
              </div>
              {!item.read && <Badge color="failure">Baru</Badge>}
            </div>

            <p className="text-slate-700 whitespace-pre-line">{item.content}</p>

            <Link to="/notifications">
              <Button color="light" className="rounded-xl">Kembali ke daftar</Button>
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
}