import api from "./auth";
import { Employee } from "../types/employee";

export const getEmployees = () => api.get<Employee[]>("/employees");


export const addEmployee = (employee: Employee) => api.post("/employees", employee);


export const updateEmployee = (id: number, employee: Employee) =>
  api.put(`/employees/${id}`, employee);


export const deleteEmployee = (id: number) => api.delete(`/employees/${id}`);
