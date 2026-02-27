import { useEffect, useState } from 'react'
import { SHIPMENTS_PER_PAGE, useCreateShipment, useShipments } from '../../hooks/useShipments'
import { useAssignments } from '../../hooks'
import ShipmentListUI from './ShipmentListUI'
import type { Shipment, CreateShipmentData } from '../../types'

export interface PaginationConfig {
  current: number
  total: number
  pageSize: number
  onChange: (page: number) => void
}

interface ShipmentListProps {
  selectedId?: string
  onSelect: (shipment: Shipment) => void
  onCreate: () => void
}

const ShipmentList: React.FC<ShipmentListProps> = ({
  selectedId,
  onSelect,
  onCreate,
}) => {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const createShipmentMutation = useCreateShipment()
  const { data: assignments = [] } = useAssignments()
  const { data: paginated, isLoading: shipmentsLoading } = useShipments(currentPage ?? 1, searchTerm ?? '')
  const shipments = paginated?.data ?? []
  const totalShipments = paginated?.total ?? 0

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
      onSearchChange={setSearchTerm}
      pagination={{
        current: currentPage,
        total: totalShipments,
        pageSize: SHIPMENTS_PER_PAGE,
        onChange: setCurrentPage,
      }}
      isLoading={shipmentsLoading}
    />
  )
}

export default ShipmentList
