import { useState } from 'react'
import { useCreateShipment } from '../../hooks/useShipments'
import { useAssignments } from '../../hooks'
import ShipmentListUI from './ShipmentListUI'
import type { Shipment, CreateShipmentData } from '../../types'

interface ShipmentListProps {
  shipments: Shipment[]
  selectedId?: string
  onSelect: (shipment: Shipment) => void
  onCreate: () => void
  searchTerm: string
  onSearchChange: (value: string) => void
}

const ShipmentList: React.FC<ShipmentListProps> = ({
  shipments,
  selectedId,
  onSelect,
  onCreate,
  searchTerm,
  onSearchChange,
}) => {
  const [showForm, setShowForm] = useState(false)
  const createShipmentMutation = useCreateShipment()
  const { data: assignments = [] } = useAssignments()

  const handleCreate = async (data: CreateShipmentData) => {
    try {
      await createShipmentMutation.mutateAsync(data)
      setShowForm(false)
      onCreate()
    } catch (error) {
      console.error('Error creating shipment:', error)
      alert('Failed to create shipment')
    }
  }

  return (
    <ShipmentListUI
      shipments={shipments}
      selectedId={selectedId}
      onSelect={onSelect}
      showForm={showForm}
      onShowForm={() => setShowForm(true)}
      onHideForm={() => setShowForm(false)}
      onCreate={handleCreate}
      assignments={assignments}
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
    />
  )
}

export default ShipmentList
