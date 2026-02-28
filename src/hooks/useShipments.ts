import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getShipments,
  getShipmentsByAssignmentId,
  getShipmentsByAssignmentIdAll,
  getShipment,
  updateShipment,
  createShipment,
  deleteShipment,
} from "../services/api";
import type { Shipment, CreateShipmentData } from "../types";

const PER_PAGE = 10;

export const useShipments = (page: number, searchTerm?: string) => {
  return useQuery({
    queryKey: ["shipments", page, searchTerm ?? ""],
    queryFn: () => getShipments(page, PER_PAGE, searchTerm),
  });
};

export const useShipmentsByAssignment = (
  assignmentId: string | undefined,
  page: number = 1,
) => {
  return useQuery({
    queryKey: ["shipments", "byAssignment", assignmentId, page],
    queryFn: () => getShipmentsByAssignmentId(assignmentId!, page, PER_PAGE),
    enabled: !!assignmentId,
  });
};

export const useShipmentsByAssignmentAll = (
  assignmentId: string | undefined,
) => {
  return useQuery({
    queryKey: ["shipments", "byAssignment", assignmentId, "all"],
    queryFn: () => getShipmentsByAssignmentIdAll(assignmentId!),
    enabled: !!assignmentId,
  });
};

export const useShipment = (id: string | undefined) => {
  return useQuery({
    queryKey: ["shipments", id],
    queryFn: () => getShipment(id!),
    enabled: !!id,
  });
};

export const useUpdateShipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Shipment> }) =>
      updateShipment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
  });
};

export const useCreateShipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateShipmentData) => createShipment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
  });
};

export const useDeleteShipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteShipment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
  });
};

export { PER_PAGE as SHIPMENTS_PER_PAGE };
