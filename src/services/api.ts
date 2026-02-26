import axios from 'axios'
import type { Shipment, Assignment, Status, CreateShipmentData, CreateAssignmentData } from '../types'

const API_BASE_URL = 'http://localhost:3001'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getShipments = async (): Promise<Shipment[]> => {
  const response = await api.get<Shipment[]>('/shipments')
  return response.data
}

export const getShipment = async (id: string): Promise<Shipment> => {
  const response = await api.get<Shipment>(`/shipments/${id}`)
  return response.data
}

export const updateShipment = async (id: string, data: Partial<Shipment>): Promise<Shipment> => {
  const response = await api.put<Shipment>(`/shipments/${id}`, data)
  return response.data
}

export const createShipment = async (data: CreateShipmentData): Promise<Shipment> => {
  const response = await api.post<Shipment>('/shipments', data)
  return response.data
}

export const deleteShipment = async (id: string): Promise<void> => {
  await api.delete(`/shipments/${id}`)
}

export const getAssignments = async (): Promise<Assignment[]> => {
  const response = await api.get<Assignment[]>('/assignments')
  return response.data
}

export const getAssignment = async (id: string): Promise<Assignment> => {
  const response = await api.get<Assignment>(`/assignments/${id}`)
  return response.data
}

export const createAssignment = async (data: CreateAssignmentData): Promise<Assignment> => {
  const response = await api.post<Assignment>('/assignments', data)
  return response.data
}

export const updateAssignment = async (id: string, data: Partial<CreateAssignmentData>): Promise<Assignment> => {
  const response = await api.put<Assignment>(`/assignments/${id}`, data)
  return response.data
}

export const deleteAssignment = async (id: string): Promise<void> => {
  await api.delete(`/assignments/${id}`)
}

export const getStatuses = async (): Promise<Status[]> => {
  const response = await api.get<Status[]>('/statuses')
  return response.data
}
