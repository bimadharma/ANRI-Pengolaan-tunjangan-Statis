import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Eye, Trash2, X } from "lucide-react";

export interface ModalField {
  name: string;
  label: string;
  type: "text" | "select" | "number" | "date" | "email" | "textarea";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  readOnly?: boolean;
}

export interface GenericModalProps {
  isOpen: boolean;
  mode: "view" | "add" | "edit" | "delete";
  title: {
    view?: string;
    add?: string;
    edit?: string;
    delete?: string;
  };
  fields: ModalField[];
  data: any;
  onClose: () => void;
  onSubmit: () => void;
  onDelete?: () => void;
  deleteMessage?: string;
}

export default function GenericModal({
  isOpen,
  mode,
  title,
  fields,
  data,
  onClose,
  onSubmit,
  onDelete,
  deleteMessage = "Apakah Anda yakin ingin menghapus data ini?",
}: GenericModalProps) {
  if (!isOpen) return null;

  const getModalConfig = () => {
    switch (mode) {
      case "view":
        return {
          headerBg: "from-blue-500 to-indigo-600",
          icon: Eye,
          title: title.view || "Detail Data",
        };
      case "add":
        return {
          headerBg: "from-blue-500 to-indigo-600",
          icon: Plus,
          title: title.add || "Tambah Data",
        };
      case "edit":
        return {
          headerBg: "from-blue-500 to-indigo-600",
          icon: Edit2,
          title: title.edit || "Edit Data",
        };
      case "delete":
        return {
          headerBg: "from-red-500 to-pink-600",
          icon: Trash2,
          title: title.delete || "Hapus Data",
        };
    }
  };

  const config = getModalConfig();
  const Icon = config.icon;

  const renderField = (field: ModalField) => {
    const value = data[field.name] || "";

    if (mode === "view") {
      return (
        <div key={field.name} className="bg-gray-50 rounded-2xl p-4">
          <p className="text-xs text-gray-500 mb-1">{field.label}</p>
          <p className="text-lg font-semibold text-gray-800">
            {field.type === "select" && field.options
              ? field.options.find((opt) => opt.value === value)?.label || value
              : value || "-"}
          </p>
        </div>
      );
    }

    const baseInputClass =
      "w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 focus:outline-none transition-all";

    switch (field.type) {
      case "select":
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <select
              className={baseInputClass}
              value={value}
              onChange={(e) => {
                data[field.name] = e.target.value;
              }}
              disabled={field.readOnly}
            >
              <option value="">{field.placeholder || `Pilih ${field.label}`}</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        );

      case "textarea":
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              className={baseInputClass + " min-h-24 resize-y"}
              placeholder={field.placeholder || `Masukkan ${field.label}`}
              value={value}
              onChange={(e) => {
                data[field.name] = e.target.value;
              }}
              readOnly={field.readOnly}
              rows={4}
            />
          </div>
        );

      default:
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={field.type}
              className={baseInputClass}
              placeholder={field.placeholder || `Masukkan ${field.label}`}
              value={value}
              onChange={(e) => {
                data[field.name] = e.target.value;
              }}
              readOnly={field.readOnly}
            />
          </div>
        );
    }
  };

  const renderViewMode = () => (
    <>
      <div className={`bg-gradient-to-r ${config.headerBg} p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Icon className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">{config.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
        {fields.map((field) => renderField(field))}
        <button
          onClick={onClose}
          className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-2xl font-medium transition-colors mt-2"
        >
          Tutup
        </button>
      </div>
    </>
  );

  const renderFormMode = () => (
    <>
      <div className={`bg-gradient-to-r ${config.headerBg} p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Icon className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">{config.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
        {fields.map((field) => renderField(field))}
        <div className="flex gap-3 pt-2 sticky bottom-0 bg-white">
          <button
            onClick={onSubmit}
            className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl font-medium transition-all hover:shadow-lg"
          >
            Simpan
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl font-medium transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </>
  );

  const renderDeleteMode = () => (
    <>
      <div className={`bg-gradient-to-r ${config.headerBg} p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Icon className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">{config.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
          <p className="text-gray-700 text-center font-medium">{deleteMessage}</p>
          <p className="text-gray-500 text-sm text-center mt-2">Tindakan ini tidak dapat dibatalkan</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onDelete}
            className="flex-1 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-2xl font-medium transition-all hover:shadow-lg"
          >
            Ya, Hapus
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl font-medium transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {mode === "view" && renderViewMode()}
          {(mode === "add" || mode === "edit") && renderFormMode()}
          {mode === "delete" && renderDeleteMode()}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}