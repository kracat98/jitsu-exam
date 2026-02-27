import axios from "axios";
import type {
  Shipment,
  Assignment,
  Status,
  CreateShipmentData,
  CreateAssignmentData,
} from "../types";

const API_BASE_URL = "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const PER_PAGE = 5;

export interface ShipmentsPaginatedResponse {
  data: Shipment[];
  total: number;
}

export const getShipments = async (
  page: number = 1,
  limit: number = PER_PAGE,
  searchTerm?: string,
): Promise<ShipmentsPaginatedResponse> => {
  const term = searchTerm?.trim();

  if (!term) {
    const response = await api.get<Shipment[]>("/shipments", {
      params: { _page: page, _limit: limit },
    });
    const total =
      Number(response.headers["x-total-count"]) || response.data.length;
    return { data: response.data, total };
  }

  const [byLabel, byClientName] = await Promise.all([
    api.get<Shipment[]>("/shipments", { params: { label_like: term } }),
    api.get<Shipment[]>("/shipments", { params: { client_name_like: term } }),
  ]);

  const seen = new Set<string>();
  const merged: Shipment[] = [];
  for (const s of [...byLabel.data, ...byClientName.data]) {
    if (seen.has(s.id)) continue;
    seen.add(s.id);
    merged.push(s);
  }
  const total = merged.length;
  const start = (page - 1) * limit;
  const data = merged.slice(start, start + limit);
  return { data, total };
};

export const getShipmentsByAssignmentId = async (
  assignmentId: string,
  page: number = 1,
  limit: number = PER_PAGE,
): Promise<ShipmentsPaginatedResponse> => {
  const response = await api.get<Shipment[]>("/shipments", {
    params: { assignment_id: assignmentId, _page: page, _limit: limit },
  });
  const total =
    Number(response.headers["x-total-count"]) || response.data.length;
  return { data: response.data, total };
};

export const getShipmentsByAssignmentIdAll = async (
  assignmentId: string,
): Promise<Shipment[]> => {
  const response = await api.get<Shipment[]>("/shipments", {
    params: { assignment_id: assignmentId },
  });
  return response.data;
};

export const getShipment = async (id: string): Promise<Shipment> => {
  const response = await api.get<Shipment>(`/shipments/${id}`);
  return response.data;
};

export const updateShipment = async (
  id: string,
  data: Partial<Shipment>,
): Promise<Shipment> => {
  const response = await api.put<Shipment>(`/shipments/${id}`, data);
  return response.data;
};

export const createShipment = async (
  data: CreateShipmentData,
): Promise<Shipment> => {
  const response = await api.post<Shipment>("/shipments", data);
  return response.data;
};

export const deleteShipment = async (id: string): Promise<void> => {
  await api.delete(`/shipments/${id}`);
};

export const getAssignments = async (): Promise<Assignment[]> => {
  const response = await api.get<Assignment[]>("/assignments");
  return response.data;
};

export interface AssignmentsPaginatedResponse {
  data: Assignment[];
  total: number;
}

export const getAssignmentsPaginated = async (
  page: number = 1,
  limit: number = PER_PAGE,
  searchTerm?: string,
): Promise<AssignmentsPaginatedResponse> => {
  const term = searchTerm?.trim();
  if (!term) {
    const response = await api.get<Assignment[]>("/assignments", {
      params: { _page: page, _limit: limit },
    });
    const total =
      Number(response.headers["x-total-count"]) || response.data.length;
    return { data: response.data, total };
  }
  const response = await api.get<Assignment[]>("/assignments", {
    params: { label_like: term },
  });
  const filtered = response.data;
  const total = filtered.length;
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);
  return { data, total };
};

export const getAssignment = async (id: string): Promise<Assignment> => {
  const response = await api.get<Assignment>(`/assignments/${id}`);
  return response.data;
};

export const createAssignment = async (
  data: CreateAssignmentData,
): Promise<Assignment> => {
  const response = await api.post<Assignment>("/assignments", data);
  return response.data;
};

export const updateAssignment = async (
  id: string,
  data: Partial<CreateAssignmentData>,
): Promise<Assignment> => {
  const response = await api.put<Assignment>(`/assignments/${id}`, data);
  return response.data;
};

export const deleteAssignment = async (id: string): Promise<void> => {
  await api.delete(`/assignments/${id}`);
};

export const getStatuses = async (): Promise<Status[]> => {
  const response = await api.get<Status[]>("/statuses");
  return response.data;
};
