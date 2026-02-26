import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Layout, Typography, Spin, Empty } from 'antd'
import { useShipments, useStatuses, useAssignments } from '../hooks'
import ShipmentList from '../components/ShipmentList/ShipmentList'
import ShipmentDetails from '../components/ShipmentDetails/ShipmentDetails'
import type { Shipment } from '../types'

const { Header: PageHeader, Content, Sider } = Layout
const { Title } = Typography

const ShipmentsPage: React.FC = () => {
  const { t } = useTranslation()
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const { data: shipments = [], isLoading: shipmentsLoading } = useShipments()
  const { data: statuses = [], isLoading: statusesLoading } = useStatuses()
  const { data: assignments = [], isLoading: assignmentsLoading } = useAssignments()

  const filteredShipments = useMemo(() => {
    if (!searchTerm.trim()) {
      return shipments
    }

    const term = searchTerm.toLowerCase()
    return shipments.filter(
      (shipment) =>
        shipment.label.toLowerCase().includes(term) ||
        shipment.client_name.toLowerCase().includes(term)
    )
  }, [searchTerm, shipments])

  const handleShipmentSelect = (shipment: Shipment) => {
    setSelectedShipment(shipment)
  }

  const handleShipmentUpdate = (updatedShipment: Shipment) => {
    setSelectedShipment(updatedShipment)
  }

  const handleShipmentDelete = (shipmentId: string) => {
    if (selectedShipment?.id === shipmentId) {
      setSelectedShipment(null)
    }
  }

  if (shipmentsLoading || statusesLoading || assignmentsLoading) {
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
          width="40%"
          style={{
            background: '#fff',
            borderRight: '1px solid #f0f0f0',
            overflow: 'auto',
          }}
        >
          <ShipmentList
            shipments={filteredShipments}
            onSelect={handleShipmentSelect}
            selectedId={selectedShipment?.id}
            onCreate={() => { }}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </Sider>
        <Content
          style={{
            width: '60%',
            background: '#fafafa',
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
            />
          ) : (
            <Empty description={t('shipments.selectToView')} />
          )}
        </Content>
      </Content>
    </Layout>
  )
}

export default ShipmentsPage
