import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getShipments, getShipment, updateShipment, createShipment, deleteShipment } from '../services/api'
import type { Shipment, CreateShipmentData } from '../types'

export const useShipments = () => {
  return useQuery({
    queryKey: ['shipments'],
    queryFn: getShipments,
  })
}

export const useShipment = (id: string | undefined) => {
  return useQuery({
    queryKey: ['shipments', id],
    queryFn: () => getShipment(id!),
    enabled: !!id,
  })
}

export const useUpdateShipment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Shipment> }) =>
      updateShipment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] })
    },
  })
}

export const useCreateShipment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateShipmentData) => createShipment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] })
    },
  })
}

export const useDeleteShipment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => deleteShipment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] })
    },
  })
}
