import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Layout, Typography, Spin, Empty } from 'antd'
import { useShipments, useAssignments, useStatuses } from '../hooks'
import AssignmentList from '../components/AssignmentList/AssignmentList'
import AssignmentDetails from '../components/AssignmentDetails/AssignmentDetails'
import ShipmentDetails from '../components/ShipmentDetails/ShipmentDetails'
import type { Assignment, Shipment } from '../types'

const { Header: PageHeader, Content, Sider } = Layout
const { Title } = Typography

const AssignmentsPage: React.FC = () => {
  const { t } = useTranslation()
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const { data: shipments = [], isLoading: shipmentsLoading } = useShipments()
  const { data: assignments = [], isLoading: assignmentsLoading } = useAssignments()
  const { data: statuses = [], isLoading: statusesLoading } = useStatuses()

  const filteredAssignments = useMemo(() => {
    if (!searchTerm.trim()) {
      return assignments
    }

    const term = searchTerm.toLowerCase()
    return assignments.filter((assignment) => assignment.label.toLowerCase().includes(term))
  }, [searchTerm, assignments])

  const assignmentShipments = useMemo(() => {
    if (!selectedAssignment) return []
    return shipments.filter((s) => s.assignment_id === selectedAssignment.id)
  }, [selectedAssignment, shipments])

  const handleAssignmentSelect = (assignment: Assignment) => {
    setSelectedAssignment(assignment)
    setSelectedShipment(null)
  }

  const handleShipmentSelect = (shipment: Shipment) => {
    setSelectedShipment(shipment)
  }

  const handleShipmentUpdate = (updatedShipment: Shipment) => {
    if (selectedShipment?.id === updatedShipment.id) {
      setSelectedShipment(updatedShipment)
    }
  }

  const handleShipmentDelete = (shipmentId: string) => {
    if (selectedShipment?.id === shipmentId) {
      setSelectedShipment(null)
    }
  }

  if (shipmentsLoading || assignmentsLoading || statusesLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip={t('common.loading')} />
      </div>
    )
  }

  return (
    <Layout style={{ height: '100%' }}>
      <PageHeader
        style={{
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          padding: '16px 24px',
        }}
      />
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
            assignments={filteredAssignments}
            onSelect={handleAssignmentSelect}
            selectedId={selectedAssignment?.id}
            onUpdate={() => { }}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
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
              shipments={assignmentShipments}
              onShipmentSelect={handleShipmentSelect}
              selectedShipmentId={selectedShipment?.id}
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
              statuses={statuses}
              assignments={assignments}
              onUpdate={handleShipmentUpdate}
              onDelete={handleShipmentDelete}
              showMapWithAllShipments={true}
              allShipments={assignmentShipments}
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
