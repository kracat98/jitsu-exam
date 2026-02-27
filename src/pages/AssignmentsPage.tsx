import { useState, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { Layout, Empty } from 'antd'
import AssignmentList from '../components/AssignmentList/AssignmentList'
import AssignmentDetails from '../components/AssignmentDetails/AssignmentDetails'
import ShipmentDetails from '../components/ShipmentDetails/ShipmentDetails'
import { useAssignment, useShipment } from '../hooks'
import { parsePage } from '../utils'
import type { Assignment, Shipment } from '../types'

const { Content, Sider } = Layout

const AssignmentsPage: React.FC = () => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const assignmentIdFromUrl = searchParams.get('assignmentId') ?? ''
  const shipmentIdFromUrl = searchParams.get('shipmentId') ?? ''
  const assignmentSearchFromUrl = searchParams.get('q') ?? ''
  const { data: assignmentFromUrl } = useAssignment(assignmentIdFromUrl || undefined)
  const { data: shipmentFromUrl } = useShipment(shipmentIdFromUrl || undefined)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)

  const assignmentPage = parsePage(searchParams.get('assignmentPage'))
  const shipmentPage = parsePage(searchParams.get('shipmentPage'))

  useEffect(() => {
    if (assignmentFromUrl) setSelectedAssignment(assignmentFromUrl)
    else if (!assignmentIdFromUrl) setSelectedAssignment(null)
  }, [assignmentFromUrl, assignmentIdFromUrl])

  useEffect(() => {
    if (shipmentFromUrl) setSelectedShipment(shipmentFromUrl)
    else if (!shipmentIdFromUrl) setSelectedShipment(null)
  }, [shipmentFromUrl, shipmentIdFromUrl])

  const setAssignmentPage = useCallback((page: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('assignmentPage', String(page))
      return next
    })
  }, [setSearchParams])

  const setShipmentPage = useCallback((page: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('shipmentPage', String(page))
      return next
    })
  }, [setSearchParams])

  const setAssignmentSearch = useCallback((value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value) next.set('q', value)
      else next.delete('q')
      next.set('assignmentPage', '1')
      return next
    })
  }, [setSearchParams])

  const handleAssignmentSelect = (assignment: Assignment) => {
    setSelectedAssignment(assignment)
    setSelectedShipment(null)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('assignmentId', assignment.id)
      next.delete('shipmentId')
      next.set('shipmentPage', '1')
      return next
    })
  }

  const handleShipmentSelect = (shipment: Shipment) => {
    setSelectedShipment(shipment)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('shipmentId', shipment.id)
      return next
    })
  }

  const handleShipmentUpdate = (updatedShipment: Shipment) => {
    if (selectedShipment?.id === updatedShipment.id) {
      setSelectedShipment(updatedShipment)
    }
  }

  const handleShipmentDelete = (shipmentId: string) => {
    if (selectedShipment?.id === shipmentId) {
      setSelectedShipment(null)
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        next.delete('shipmentId')
        return next
      })
    }
  }

  return (
    <Layout style={{ height: '100%' }}>
      <Content style={{ display: 'flex', height: 'calc(100% - 64px)' }}>
        <Sider
          width="30%"
          style={{
            background: '#fff',
            borderRight: '1px solid #f0f0f0',
            overflow: 'auto',
          }}
        >
          <AssignmentList
            onSelect={handleAssignmentSelect}
            selectedId={selectedAssignment?.id}
            onUpdate={() => {}}
            currentPage={assignmentPage}
            onPageChange={setAssignmentPage}
            searchTerm={assignmentSearchFromUrl}
            onSearchChange={setAssignmentSearch}
          />
        </Sider>
        <Sider
          width="35%"
          style={{
            background: '#fafafa',
            borderRight: '1px solid #f0f0f0',
            overflow: 'auto',
          }}
        >
          {selectedAssignment ? (
            <AssignmentDetails
              assignment={selectedAssignment}
              onShipmentSelect={handleShipmentSelect}
              selectedShipmentId={selectedShipment?.id}
              shipmentPage={shipmentPage}
              onShipmentPageChange={setShipmentPage}
            />
          ) : (
            <Empty description={t('assignments.selectToView')} style={{ marginTop: '50%' }} />
          )}
        </Sider>
        <Content
          style={{
            width: '35%',
            background: '#fff',
            overflow: 'auto',
            padding: '24px',
          }}
        >
          {selectedShipment ? (
            <ShipmentDetails
              shipment={selectedShipment}
              onUpdate={handleShipmentUpdate}
              onDelete={handleShipmentDelete}
              showMapWithAllShipments={true}
              assignmentId={selectedAssignment?.id}
            />
          ) : (
            <Empty description={t('assignments.selectShipmentToView')} />
          )}
        </Content>
      </Content>
    </Layout>
  )
}

export default AssignmentsPage
