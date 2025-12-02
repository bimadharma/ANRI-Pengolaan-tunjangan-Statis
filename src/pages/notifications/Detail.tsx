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
    <MainLayout>
      <div className="p-6 max-w-3xl mx-auto">
        {loading ? (
          <p className="text-gray-500 text-center">Memuat...</p>
        ) : !item ? (
          <div className="space-y-6 text-center bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500 text-lg">Notifikasi tidak ditemukan.</p>
            <Link to="/notifications">
              <Button color="blue" className="rounded-xl px-6">
                Kembali
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow p-8 space-y-6 border border-gray-100">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 leading-snug">{item.title}</h1>
                <p className="text-xs text-gray-500 mt-1">{new Date(item.date).toLocaleString()}</p>
              </div>

              {!item.read && (
                <Badge color="failure" className="px-3 py-1 text-[11px]">
                  Baru
                </Badge>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Content */}
            <p className="text-slate-700 text-base leading-relaxed whitespace-pre-line">{item.content}</p>

            {/* Back Button */}
            <div className="pt-2">
              <Link to="/notifications">
                <Button
                  color="light"
                  className="rounded-xl px-6 shadow-sm hover:shadow-md transition 
             text-gray-700 border border-gray-200"
                >
                  Kembali
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
