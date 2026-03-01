import { Empty, Layout } from 'antd'
import ShipmentDetails from './ShipmentDetails'
import ShipmentList from './ShipmentList'
import { useShipmentsInformation } from '../../hooks/useShipmentsInformation'
import { useTranslation } from 'react-i18next'

const { Content, Sider } = Layout

const ShipmentsPage: React.FC = () => {
  const { t } = useTranslation()
  const { selectedShipment } = useShipmentsInformation()

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
          <ShipmentList onCreate={() => { }} />
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
