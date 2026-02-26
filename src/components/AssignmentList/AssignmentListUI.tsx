import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Layout, Typography, Button, Card, Space, Divider, Input } from 'antd'
import { StatusBadge } from '../shared/StatusBadge'
import type { Assignment } from '../../types'
import AssignmentForm from '../AssignmentForm/AssignmentForm'

const { Header, Content } = Layout
const { Title, Text } = Typography

const STATUS_ORDER = ['OPEN', 'IN_TRANSIT', 'DELIVERED'] as const

interface AssignmentListUIProps {
  assignments: Assignment[]
  selectedId?: string
  onSelect: (assignment: Assignment) => void
  showForm: boolean
  onShowForm: () => void
  onHideForm: () => void
  onCreate: (data: any) => void
  searchTerm: string
  onSearchChange: (value: string) => void
}

const AssignmentListUI: React.FC<AssignmentListUIProps> = memo(({
  assignments,
  selectedId,
  onSelect,
  showForm,
  onShowForm,
  onHideForm,
  onCreate,
  searchTerm,
  onSearchChange,
}) => {
  const { t } = useTranslation()
  const groupedAssignments = assignments.reduce((acc, assignment) => {
    const status = assignment.status || 'OPEN'
    if (!acc[status]) {
      acc[status] = []
    }
    acc[status].push(assignment)
    return acc
  }, {} as Record<string, Assignment[]>)

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
              {t('assignments.list.title')}
            </Title>
            <Button type="primary" onClick={onShowForm}>
              {t('assignments.list.newButton')}
            </Button>
          </div>
        </Space>
      </Header>

      {showForm && <AssignmentForm onSave={onCreate} onCancel={onHideForm} />}

      <Content style={{ overflow: 'auto', padding: '16px' }}>
        <Input.Search
          placeholder={t('assignments.searchPlaceholder')}
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          allowClear
        />
        {STATUS_ORDER.map((status) => {
          const groupAssignments = groupedAssignments[status] || []
          if (groupAssignments.length === 0) return null

          return (
            <div key={status} style={{ marginBottom: '32px' }}>
              <Space style={{ marginBottom: '12px' }}>
                <StatusBadge status={status}>{t(`assignments.status.${status.toLowerCase()}`)}</StatusBadge>
                <Text type="secondary">({groupAssignments.length})</Text>
              </Space>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                {groupAssignments.map((assignment) => (
                  <Card
                    key={assignment.id}
                    size="small"
                    hoverable
                    onClick={() => onSelect(assignment)}
                    style={{
                      cursor: 'pointer',
                      borderColor: selectedId === assignment.id ? '#3498db' : undefined,
                      backgroundColor: selectedId === assignment.id ? '#e3f2fd' : undefined,
                    }}
                  >
                    <div style={{ marginBottom: '8px' }}>
                      <Text strong>{assignment.label}</Text>
                    </div>
                    <Space split={<Divider type="vertical" />}>
                      <Text type="secondary">
                        {t('assignments.list.shipmentsCount', { count: assignment.shipment_count || 0 })}
                      </Text>
                    </Space>
                    {assignment.clients && assignment.clients.length > 0 && (
                      <div style={{ marginTop: '4px' }}>
                        <Text type="secondary" style={{ fontSize: '0.85rem' }}>
                          {assignment.clients.join(', ')}
                        </Text>
                      </div>
                    )}
                  </Card>
                ))}
              </Space>
            </div>
          )
        })}
      </Content>
    </Layout>
  )
})

AssignmentListUI.displayName = 'AssignmentListUI'

export default AssignmentListUI
