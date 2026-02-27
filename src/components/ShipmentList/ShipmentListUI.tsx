import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Layout, Typography, Button, Card, Space, Divider, Pagination, Spin } from 'antd'
import { StatusBadge } from '../shared/StatusBadge'
import Search from '../shared/Search'
import type { Shipment, Assignment } from '../../types'
import ShipmentForm from '../ShipmentForm/ShipmentForm'
import type { PaginationConfig } from './ShipmentList'
import { formatDate } from '../../utils'

const { Header, Content } = Layout
const { Title, Text } = Typography

const STATUS_ORDER = ['OPEN', 'IN_TRANSIT', 'DELIVERED'] as const

interface ShipmentListUIProps {
  shipments: Shipment[]
  selectedId?: string
  onSelect: (shipment: Shipment) => void
  showForm: boolean
  onShowForm: () => void
  onHideForm: () => void
  onCreate: (shipment: any) => void
  assignments?: Assignment[]
  searchTerm: string
  onSearchChange: (value: string) => void
  pagination?: PaginationConfig
  isLoading?: boolean
}

const ShipmentListUI: React.FC<ShipmentListUIProps> = memo(({
  shipments,
  selectedId,
  onSelect,
  showForm,
  onShowForm,
  onHideForm,
  onCreate,
  assignments = [],
  searchTerm,
  onSearchChange,
  pagination,
  isLoading = false,
}) => {
  const { t, i18n } = useTranslation()
  const groupedShipments = shipments.reduce((acc, shipment) => {
    const status = shipment.status || 'OPEN'
    if (!acc[status]) {
      acc[status] = []
    }
    acc[status].push(shipment)
    return acc
  }, {} as Record<string, Shipment[]>)

  return (
    <Layout style={{ height: '100%' }}>
      <Header
        style={{
          background: '#f8f9fa',
          borderBottom: '1px solid #f0f0f0',
          padding: '16px 24px',
        }}
      >
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0 }}>
              {t('shipments.list.title')}
            </Title>
            <Button type="primary" onClick={onShowForm}>
              {t('shipments.list.addButton')}
            </Button>
          </div>
        </Space>
      </Header>

      {showForm && (
        <ShipmentForm onSave={onCreate} onCancel={onHideForm} assignments={assignments} />
      )}

      <Content style={{ overflow: 'auto', padding: '16px' }}>
        <Search
          value={searchTerm}
          onSearchChange={onSearchChange}
          placeholder={t('shipments.searchPlaceholder')}
          allowClear
        />
        <div style={{ marginTop: 16 }}>
          {isLoading ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 700,
                padding: 24,
              }}
              aria-busy="true"
              aria-live="polite"
            >
              <Spin tip={t('common.loading')} />
            </div>
          ) : (
            <>
              {STATUS_ORDER.map((status) => {
                const groupShipments = groupedShipments[status] || []
                if (groupShipments.length === 0) return null

                return (
                  <div key={status} style={{ marginBottom: '32px' }}>
                    <Space style={{ marginBottom: '12px' }}>
                      <StatusBadge status={status}>{t(`shipments.status.${status.toLowerCase()}`)}</StatusBadge>
                      <Text type="secondary">({groupShipments.length})</Text>
                    </Space>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      {groupShipments.map((shipment) => (
                        <Card
                          key={shipment.id}
                          size="small"
                          hoverable
                          onClick={() => onSelect(shipment)}
                          style={{
                            cursor: 'pointer',
                            borderColor: selectedId === shipment.id ? '#3498db' : undefined,
                            backgroundColor: selectedId === shipment.id ? '#e3f2fd' : undefined,
                          }}
                        >
                          <div style={{ marginBottom: '8px' }}>
                            <Text strong>{shipment.label}</Text>
                          </div>
                          <Space split={<Divider type="vertical" />}>
                            <Text>{shipment.client_name}</Text>
                            <Text type="secondary">{formatDate(shipment.arrival_date, i18n.language)}</Text>
                          </Space>
                        </Card>
                      ))}
                    </Space>
                  </div>
                )
              })}
            </>
          )}
        </div>
        {pagination && (
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              current={pagination.current}
              total={pagination.total}
              pageSize={pagination.pageSize}
              onChange={pagination.onChange}
              showSizeChanger={false}
            />
          </div>
        )}
      </Content>
    </Layout>
  )
})

ShipmentListUI.displayName = 'ShipmentListUI'

export default ShipmentListUI
