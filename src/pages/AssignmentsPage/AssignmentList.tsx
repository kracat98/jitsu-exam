import { Button, Layout, Space, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ItemList from '../../components/ItemList/ItemList'
import {
  ASSIGNMENTS_PER_PAGE,
  useAssignmentsPaginated
} from '../../hooks'
import { useAssignmentsInformation } from '../../hooks/useAssignmentsInformation'
import type { Assignment } from '../../types'
import AssignmentForm from './AssignmentForm'

const { Header, Content } = Layout
const { Title, Text } = Typography

interface AssignmentListProps {
  onUpdate: () => void
}

const AssignmentList: React.FC<AssignmentListProps> = () => {
  const { t } = useTranslation()
  const [showForm, setShowForm] = useState(false)
  const [internalSearchTerm, setInternalSearchTerm] = useState('')
  const [internalPage, setInternalPage] = useState(1)
  const { selectedAssignment, assignmentSearchFromUrl: controlledSearchTerm, assignmentPage: controlledPage, setAssignmentPage: onPageChange, setAssignmentSearch: onSearchChange, handleAssignmentSelect: onSelect } = useAssignmentsInformation()

  const selectedId = selectedAssignment?.id
  const isPageControlled = controlledPage !== undefined && onPageChange !== undefined
  const isSearchControlled = controlledSearchTerm !== undefined && onSearchChange !== undefined
  const currentPage = isPageControlled ? controlledPage : internalPage
  const setCurrentPage = isPageControlled ? onPageChange! : setInternalPage
  const searchTerm = isSearchControlled ? controlledSearchTerm : internalSearchTerm
  const setSearchTerm = isSearchControlled ? onSearchChange! : setInternalSearchTerm

  useEffect(() => {
    if (!isPageControlled) setInternalPage(1)
  }, [searchTerm, isPageControlled])

  const { data: paginated, isLoading: assignmentsLoading } = useAssignmentsPaginated(
    currentPage,
    searchTerm ?? '',
  )
  const assignments = paginated?.data ?? []
  const totalAssignments = paginated?.total ?? 0

  const pagination = {
    current: currentPage,
    total: totalAssignments,
    pageSize: ASSIGNMENTS_PER_PAGE,
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
        <AssignmentForm />
      </Header>

      <Content style={{ overflow: 'auto', padding: '16px' }}>
        <ItemList<Assignment>
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder={t('assignments.searchPlaceholder')}
          loadingText={t('common.loading')}
          isLoading={assignmentsLoading}
          items={assignments}
          getStatusLabel={(status) => t(`assignments.status.${status.toLowerCase()}`)}
          renderItemContent={(assignment) => (
            <>
              <div style={{ marginBottom: '8px' }}>
                <Text strong>{assignment.label}</Text>
              </div>
              <div style={{ marginTop: '4px' }}>
                <Text type="secondary" style={{ fontSize: '0.85rem' }}>
                  {assignment.clients?.length
                    ? assignment.clients.join(', ')
                    : t('common.none')}
                </Text>
              </div>
            </>
          )}
          selectedId={selectedId}
          onSelect={onSelect}
          pagination={pagination}
          showPaginationWhenTotalOver={ASSIGNMENTS_PER_PAGE}
        />
      </Content>
    </Layout>)
}

export default AssignmentList
