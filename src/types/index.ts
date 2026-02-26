export interface Shipment {
  id: string
  client_name: string
  label: string
  status: 'OPEN' | 'IN_TRANSIT' | 'DELIVERED'
  arrival_date: string
  delivery_by_date: string
  eta: string
  warehouse_id: string
  assignment_id?: string
  lat: number
  lng: number
}

export interface Assignment {
  id: string
  label: string
  status: 'OPEN' | 'IN_TRANSIT' | 'DELIVERED'
  clients: string[]
  shipment_count: number
}

export interface Status {
  id: string
}

export interface ShipmentFormData {
  status: string
  assignment_id: string
  delivery_by_date: string
  lat: string
  lng: string
}

export interface CreateShipmentData {
  client_name: string
  label: string
  status: string
  arrival_date: string
  delivery_by_date: string
  warehouse_id: string
  assignment_id?: string
  lat?: number
  lng?: number
}

export interface CreateAssignmentData {
  label: string
  status: string
  clients: string[]
}
