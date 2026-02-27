import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SHIPMENTS_PER_PAGE, useCreateShipment, useShipments } from '../../hooks/useShipments'
import { useAssignments } from '../../hooks'
import { parsePage } from '../../utils'
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
  const [searchParams, setSearchParams] = useSearchParams()
  const [showForm, setShowForm] = useState(false)

  const currentPage = parsePage(searchParams.get('page'))
  const searchTerm = searchParams.get('q') ?? ''

  const setCurrentPage = (page: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('page', String(page))
      return next
    })
  }

  const setSearchTerm = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value) next.set('q', value)
      else next.delete('q')
      next.set('page', '1')
      return next
    })
  }

  const createShipmentMutation = useCreateShipment()
  const { data: assignments = [] } = useAssignments()
  const { data: paginated, isLoading: shipmentsLoading } = useShipments(currentPage, searchTerm)
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
