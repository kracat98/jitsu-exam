import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { Empty, Layout } from 'antd'
import ShipmentDetails from '../components/ShipmentDetails/ShipmentDetails'
import ShipmentList from '../components/ShipmentList/ShipmentList'
import { useShipment } from '../hooks'
import type { Shipment } from '../types'

const { Content, Sider } = Layout

const ShipmentsPage: React.FC = () => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const shipmentIdFromUrl = searchParams.get('shipmentId') ?? ''
  const { data: shipmentFromUrl } = useShipment(shipmentIdFromUrl || undefined)
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)

  useEffect(() => {
    if (shipmentFromUrl) setSelectedShipment(shipmentFromUrl)
    else if (!shipmentIdFromUrl) setSelectedShipment(null)
  }, [shipmentFromUrl, shipmentIdFromUrl])

  const handleShipmentSelect = (shipment: Shipment) => {
    setSelectedShipment(shipment)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('shipmentId', shipment.id)
      return next
    })
  }

  const handleShipmentUpdate = (updatedShipment: Shipment) => {
    setSelectedShipment(updatedShipment)
    if (selectedShipment?.id === updatedShipment.id) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        next.set('shipmentId', updatedShipment.id)
        return next
      })
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
