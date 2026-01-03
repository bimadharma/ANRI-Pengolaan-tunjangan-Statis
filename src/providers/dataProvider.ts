import { DataProvider } from "@refinedev/core";
import axios, { AxiosInstance } from "axios";

const API_URL = "http://localhost:3001";

const axiosInstance: AxiosInstance = axios.create();

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination }) => {
    const url = `${API_URL}/${resource}`;
    
    const { data, headers } = await axiosInstance.get(url, {
      params: {
        _page: pagination?.mode === "server" ? (pagination as any).current : 1,
        _limit: pagination?.mode === "server" ? (pagination as any).pageSize : 10,
      },
    });

    const total = headers["x-total-count"] ? parseInt(headers["x-total-count"]) : data.length;

    return {
      data,
      total,
    };
  },

  getOne: async ({ resource, id }) => {
    const url = `${API_URL}/${resource}/${id}`;
    const { data } = await axiosInstance.get(url);

    return {
      data,
    };
  },

  create: async ({ resource, variables }) => {
    const url = `${API_URL}/${resource}`;
    const { data } = await axiosInstance.post(url, variables);

    return {
      data,
    };
  },

  update: async ({ resource, id, variables }) => {
    const url = `${API_URL}/${resource}/${id}`;
    const { data } = await axiosInstance.patch(url, variables);

    return {
      data,
    };
  },

  deleteOne: async ({ resource, id }) => {
    const url = `${API_URL}/${resource}/${id}`;
    const { data } = await axiosInstance.delete(url);

    return {
      data,
    };
  },

  getApiUrl: () => API_URL,

  custom: async ({ url, method, payload, query, headers }) => {
    const { data } = await axiosInstance({
      url: `${API_URL}${url}`,
      method,
      data: payload,
      params: query,
      headers,
    });

    return { data };
  },
};
