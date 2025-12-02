import { useEffect, useState } from "react";
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from "../api/employees";
import { Employee, FormData, PopupState, Toast } from "../types/employee";
import { sanitizeMoney, formatSalary } from "../utils/salary";

type SortColumn = "name" | "position" | "email" | "salary";

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState<SortColumn>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [popup, setPopup] = useState<PopupState>({
    open: false,
    mode: "",
    data: null,
  });
  const [formData, setFormData] = useState<FormData>({
    name: "",
    position: "",
    email: "",
    status: "",
    salary: "",
    startDate: "",
  });

  // Tambahan state loading & error
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch employees
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await getEmployees();
      setEmployees(res.data);
      setError(null);
    } catch (err: any) {
      console.error("Gagal fetch employees:", err);
      setError(err.message || "Terjadi kesalahan saat fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const pushToast = (type: Toast["type"], message?: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleSort = (col: SortColumn) => {
    if (sortBy !== col) {
      setSortBy(col);
      setSortDir("asc");
    } else {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    }
  };

  const filteredEmployees = employees.filter((e) => {
    const q = filter.toLowerCase();
    const salaryText = formatSalary(e.salary).toLowerCase();
    return (
      e.name.toLowerCase().includes(q) ||
      e.position.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      salaryText.includes(q)
    );
  });

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    let x: string | number = "";
    let y: string | number = "";
    switch (sortBy) {
      case "salary":
        x = sanitizeMoney(a.salary);
        y = sanitizeMoney(b.salary);
        break;
      case "name":
        x = a.name.toLowerCase();
        y = b.name.toLowerCase();
        break;
      case "position":
        x = a.position.toLowerCase();
        y = b.position.toLowerCase();
        break;
      case "email":
        x = a.email.toLowerCase();
        y = b.email.toLowerCase();
        break;
    }
    if (x < y) return sortDir === "asc" ? -1 : 1;
    if (x > y) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  return {
    employees: sortedEmployees,
    filter,
    setFilter,
    sortBy,
    sortDir,
    toggleSort,
    toasts,
    pushToast,
    popup,
    setPopup,
    formData,
    setFormData,
    handleInputChange,
    setEmployees,
    loading,
    error,
    fetchEmployees, // buat refresh manual kalau perlu
  };
};
