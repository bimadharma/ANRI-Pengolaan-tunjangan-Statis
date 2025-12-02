export interface Employee {
  id: number;
  name: string;
  position: string;
  email: string;
  status: string;
  salary: string;
  startDate: string;
}

export interface FormData {
  name: string;
  position: string;
  email: string;
  status: string;
  salary: string;
  startDate: string;
}

export interface PopupState {
  open: boolean;
  mode: string;
  data: Employee | null;
}

export interface Toast {
  id: number;
  type: "success" | "warning" | "error" | "info";
  message?: string;
}
