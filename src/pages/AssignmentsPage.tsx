import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Layout, Empty } from 'antd'
import AssignmentList from '../components/AssignmentList/AssignmentList'
import AssignmentDetails from '../components/AssignmentDetails/AssignmentDetails'
import ShipmentDetails from '../components/ShipmentDetails/ShipmentDetails'
import type { Assignment, Shipment } from '../types'

const { Header: PageHeader, Content, Sider } = Layout

const AssignmentsPage: React.FC = () => {
  const { t } = useTranslation()
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)

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
            onUpdate={() => { }}
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
