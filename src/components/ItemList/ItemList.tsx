import React, { memo } from 'react'
import { Card, Pagination, Space, Spin, Typography } from 'antd'
import Search from '../shared/Search'
import { StatusBadge } from '../shared/StatusBadge'

const { Text } = Typography

export interface ItemListPaginationConfig {
  current: number
  total: number
  pageSize: number
  onChange: (page: number) => void
}

export interface ItemListProps<T extends { id: string; status?: string }> {
  searchTerm: string
  onSearchChange: (value: string) => void
  searchPlaceholder: string
  loadingText?: string
  isLoading: boolean
  loadingMinHeight?: number
  items: T[]
  getStatusLabel: (status: string) => string
  renderItemContent: (item: T) => React.ReactNode
  selectedId?: string
  onSelect: (item: T) => void
  pagination?: ItemListPaginationConfig
  showPaginationWhenTotalOver?: number
}

const STATUS_ORDER = ['OPEN', 'IN_TRANSIT', 'DELIVERED'] as const

function ItemListInner<T extends { id: string; status?: string }>({
  searchTerm,
  onSearchChange,
  searchPlaceholder,
  loadingText = 'Loading...',
  isLoading,
  loadingMinHeight = 280,
  items,
  getStatusLabel,
  renderItemContent,
  selectedId,
  onSelect,
  pagination,
  showPaginationWhenTotalOver = 5,
}: ItemListProps<T>) {
  const grouped = STATUS_ORDER.reduce(
    (acc, status) => {
      acc[status] = items.filter((item) => (item.status || 'OPEN') === status)
      return acc
    },
    {} as Record<string, T[]>,
  )

  return (
    <>
      <Search
        value={searchTerm}
        onSearchChange={onSearchChange}
        placeholder={searchPlaceholder}
        allowClear
      />
      <div style={{ marginTop: 16 }}>
        {isLoading ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: loadingMinHeight,
              padding: 24,
            }}
            aria-busy="true"
            aria-live="polite"
          >
            <Spin tip={loadingText} />
          </div>
        ) : (
          <>
            {STATUS_ORDER.map((status) => {
              const groupItems = grouped[status] || []
              if (groupItems.length === 0) return null

              return (
                <div key={status} style={{ marginBottom: '32px' }}>
                  <Space style={{ marginBottom: '12px' }}>
                    <StatusBadge status={status as (typeof STATUS_ORDER)[number]}>
                      {getStatusLabel(status)}
                    </StatusBadge>
                    <Text type="secondary">({groupItems.length})</Text>
                  </Space>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    {groupItems.map((item) => {
                      const id = item.id
                      return (
                        <Card
                          key={id}
                          size="small"
                          hoverable
                          onClick={() => onSelect(item)}
                          style={{
                            cursor: 'pointer',
                            borderColor: selectedId === id ? '#3498db' : undefined,
                            backgroundColor: selectedId === id ? '#e3f2fd' : undefined,
                          }}
                        >
                          {renderItemContent(item)}
                        </Card>
                      )
                    })}
                  </Space>
                </div>
              )
            })}
            {pagination &&
              showPaginationWhenTotalOver != null &&
              pagination.total > showPaginationWhenTotalOver && (
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
          </>
        )}
      </div>
    </>
  )
}

const ItemList = memo(ItemListInner) as <T extends { id: string; status?: string }>(
  props: ItemListProps<T>,
) => React.ReactElement

export default ItemList
