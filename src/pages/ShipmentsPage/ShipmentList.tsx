import { Divider, Layout, Space, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import ItemList from '../../components/ItemList/ItemList'
import { SHIPMENTS_PER_PAGE, useShipments } from '../../hooks/useShipments'
import { useShipmentsInformation } from '../../hooks/useShipmentsInformation'
import type { Shipment } from '../../types'
import { formatDate, parsePage } from '../../utils'
import ShipmentForm from './ShipmentForm'

const { Header, Content } = Layout
const { Text } = Typography

export interface PaginationConfig {
  current: number
  total: number
  pageSize: number
  onChange: (page: number) => void
}

interface ShipmentListProps {
  onCreate: () => void
}

const ShipmentList: React.FC<ShipmentListProps> = () => {
  const { t, i18n } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { selectedShipment, handleShipmentSelect: onSelect } = useShipmentsInformation()

  const selectedId = selectedShipment?.id
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

  const { data: paginated, isLoading: shipmentsLoading } = useShipments(currentPage, searchTerm)
  const shipments = paginated?.data ?? []
  const totalShipments = paginated?.total ?? 0

  const pagination = {
    current: currentPage,
    total: totalShipments,
    pageSize: SHIPMENTS_PER_PAGE,
    onChange: setCurrentPage,
  }

  return (
    <Layout style={{ height: '100%' }}>
      <Header
        style={{
          background: '#f8f9fa',
          borderBottom: '1px solid #f0f0f0',
          padding: '16px 24px',
        }}
      >
        <ShipmentForm />
      </Header>

      <Content style={{ overflow: 'auto', padding: '16px' }}>
        <ItemList<Shipment>
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder={t('shipments.searchPlaceholder')}
          loadingText={t('common.loading')}
          isLoading={shipmentsLoading}
          items={shipments}
          getStatusLabel={(status) => t(`shipments.status.${status.toLowerCase()}`)}
          renderItemContent={(shipment) => (
            <>
              <div style={{ marginBottom: '8px' }}>
                <Text strong>{shipment.label}</Text>
              </div>
              <Space split={<Divider type="vertical" />}>
                <Text>{shipment.client_name}</Text>
                <Text type="secondary">{formatDate(shipment.arrival_date, i18n.language)}</Text>
              </Space>
            </>
          )}
          selectedId={selectedId}
          onSelect={onSelect}
          pagination={pagination}
          showPaginationWhenTotalOver={SHIPMENTS_PER_PAGE}
        />
      </Content>
    </Layout>
  )
}

export default ShipmentList
