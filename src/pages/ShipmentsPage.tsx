import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Empty, Layout } from 'antd'
import ShipmentDetails from '../components/ShipmentDetails/ShipmentDetails'
import ShipmentList from '../components/ShipmentList/ShipmentList'
import type { Shipment } from '../types'

const { Content, Sider } = Layout

const ShipmentsPage: React.FC = () => {
  const { t } = useTranslation()
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)

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

  return (
    <Layout style={{ height: '100%' }}>
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
            onSelect={handleShipmentSelect}
            selectedId={selectedShipment?.id}
            onCreate={() => {}}
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
