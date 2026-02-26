import { useState, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Layout, Typography, Button, Space, Descriptions, Card, Empty, Modal, Divider } from 'antd'
import { useDeleteAssignment } from '../../hooks/useAssignments'
import { StatusBadge } from '../shared/StatusBadge'
import type { Assignment, Shipment } from '../../types'

const { Header, Content } = Layout
const { Title, Text } = Typography

interface AssignmentDetailsProps {
  assignment: Assignment
  shipments: Shipment[]
  onShipmentSelect: (shipment: Shipment) => void
  selectedShipmentId?: string
}

const formatDate = (dateString: string, locale: string): string => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const AssignmentDetails: React.FC<AssignmentDetailsProps> = memo(({
  assignment,
  shipments,
  onShipmentSelect,
  selectedShipmentId,
}) => {
  const { t, i18n } = useTranslation()
  const deleteMutation = useDeleteAssignment()

  const handleDelete = async () => {
    if (shipments.length > 0) {
      Modal.warning({
        title: t('assignments.details.cannotDelete'),
      })
      return
    }

    Modal.confirm({
      title: t('assignments.details.deleteConfirm'),
      okText: t('assignments.details.yesDelete'),
      okType: 'danger',
      cancelText: t('common.cancel'),
      onOk: async () => {
        try {
          await deleteMutation.mutateAsync(assignment.id)
          window.location.reload()
        } catch (error) {
          console.error('Error deleting assignment:', error)
          Modal.error({
            title: t('assignments.details.deleteError'),
          })
        }
      },
    })
  }

  return (
    <Layout style={{ height: '100%', background: '#fff' }}>
      <Header
        style={{
          background: '#f8f9fa',
          borderBottom: '1px solid #f0f0f0',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          {t('assignments.details.title')}
        </Title>
        {shipments.length === 0 && (
          <Button danger onClick={handleDelete}>
            {t('common.delete')}
          </Button>
        )}
      </Header>

      <Content style={{ overflow: 'auto', padding: '24px' }}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label={t('assignments.details.label')}>
            {assignment.label}
          </Descriptions.Item>
          <Descriptions.Item label={t('assignments.details.status')}>
            <StatusBadge status={assignment.status}>
              {t(`assignments.status.${assignment.status.toLowerCase()}`)}
            </StatusBadge>
          </Descriptions.Item>
          <Descriptions.Item label={t('assignments.details.clients')}>
            {assignment.clients && assignment.clients.length > 0
              ? assignment.clients.join(', ')
              : t('common.none')}
          </Descriptions.Item>
          <Descriptions.Item label={t('assignments.details.shipmentCount')}>
            {shipments.length}
          </Descriptions.Item>
        </Descriptions>

        <Card
          title={`${t('assignments.details.shipments')} (${shipments.length})`}
          style={{ marginTop: '24px' }}
        >
          {shipments.length === 0 ? (
            <Empty description={t('assignments.details.noShipments')} />
          ) : (
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              {shipments.map((shipment) => (
                <Card
                  key={shipment.id}
                  size="small"
                  hoverable
                  onClick={() => onShipmentSelect(shipment)}
                  style={{
                    cursor: 'pointer',
                    borderColor: selectedShipmentId === shipment.id ? '#3498db' : undefined,
                    backgroundColor: selectedShipmentId === shipment.id ? '#e3f2fd' : undefined,
                  }}
                >
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Text strong>{shipment.label}</Text>
                    <StatusBadge status={shipment.status}>
                      {t(`shipments.status.${shipment.status.toLowerCase()}`)}
                    </StatusBadge>
                  </Space>
                  <Divider style={{ margin: '8px 0' }} />
                  <Space split={<Divider type="vertical" />}>
                    <Text>{shipment.client_name}</Text>
                    <Text type="secondary">{formatDate(shipment.arrival_date, i18n.language)}</Text>
                  </Space>
                </Card>
              ))}
            </Space>
          )}
        </Card>
      </Content>
    </Layout>
  )
})

AssignmentDetails.displayName = 'AssignmentDetails'

export default AssignmentDetails
