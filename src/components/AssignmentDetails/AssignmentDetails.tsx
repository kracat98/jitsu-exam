import { useState, useEffect, memo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Layout,
  Typography,
  Button,
  Space,
  Descriptions,
  Card,
  Empty,
  Modal,
  Divider,
  Pagination,
  Spin,
  Tooltip,
} from 'antd'
import { useDeleteAssignment } from '../../hooks/useAssignments'
import { useShipmentsByAssignment, SHIPMENTS_PER_PAGE } from '../../hooks'
import { StatusBadge } from '../shared/StatusBadge'
import type { Assignment, Shipment } from '../../types'
import { formatDate } from '../../utils'

const { Header, Content } = Layout
const { Title, Text } = Typography

interface AssignmentDetailsProps {
  assignment: Assignment
  onShipmentSelect: (shipment: Shipment) => void
  selectedShipmentId?: string
  /** Controlled from URL on Assignments page */
  shipmentPage?: number
  onShipmentPageChange?: (page: number) => void
}

const AssignmentDetails: React.FC<AssignmentDetailsProps> = memo(({
  assignment,
  onShipmentSelect,
  selectedShipmentId,
  shipmentPage: controlledPage,
  onShipmentPageChange,
}) => {
  const { t, i18n } = useTranslation()
  const [internalPage, setInternalPage] = useState(1)
  const isControlled = controlledPage !== undefined && onShipmentPageChange !== undefined
  const currentPage = isControlled ? controlledPage : internalPage
  const setCurrentPage = isControlled ? onShipmentPageChange! : setInternalPage

  const deleteMutation = useDeleteAssignment()
  const { data: paginated, isLoading: shipmentsLoading } = useShipmentsByAssignment(
    assignment.id,
    currentPage,
  )
  const shipments = paginated?.data ?? []
  const totalShipments = paginated?.total ?? 0

  useEffect(() => {
    if (!isControlled) setInternalPage(1)
  }, [assignment.id, isControlled])

  const handleDelete = async () => {
    if (totalShipments > 0) {
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
        <Tooltip
          title="You can only delete this assignment when it has no shipments"
          mouseEnterDelay={0.3}
        >
          <span style={{ display: 'inline-block' }}>
            <Button
              danger
              onClick={handleDelete}
              disabled={totalShipments > 0}
            >
              {t('common.delete')}
            </Button>
          </span>
        </Tooltip>
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
            {totalShipments}
          </Descriptions.Item>
        </Descriptions>

        <Card
          title={`${t('assignments.details.shipments')} (${totalShipments})`}
          style={{ marginTop: '24px' }}
        >
          <div style={{ minHeight: 600 }}>
            {shipmentsLoading ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 200,
                  padding: 24,
                }}
                aria-busy="true"
                aria-live="polite"
              >
                <Spin tip={t('common.loading')} />
              </div>
            ) : shipments.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                <Empty description={t('assignments.details.noShipments')} />
              </div>
            ) : (
              <>
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
                {totalShipments > SHIPMENTS_PER_PAGE && (
                  <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                      current={currentPage}
                      total={totalShipments}
                      pageSize={SHIPMENTS_PER_PAGE}
                      onChange={setCurrentPage}
                      showSizeChanger={false}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      </Content>
    </Layout>
  )
})

AssignmentDetails.displayName = 'AssignmentDetails'

export default AssignmentDetails
