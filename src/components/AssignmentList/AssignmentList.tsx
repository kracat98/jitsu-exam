import { useEffect, useState } from 'react'
import {
  ASSIGNMENTS_PER_PAGE,
  useAssignmentsPaginated,
  useCreateAssignment,
} from '../../hooks'
import AssignmentListUI from './AssignmentListUI'
import type { Assignment, CreateAssignmentData } from '../../types'

interface AssignmentListProps {
  selectedId?: string
  onSelect: (assignment: Assignment) => void
  onUpdate: () => void
  /** Controlled from URL on Assignments page */
  currentPage?: number
  onPageChange?: (page: number) => void
  searchTerm?: string
  onSearchChange?: (value: string) => void
}

const AssignmentList: React.FC<AssignmentListProps> = ({
  selectedId,
  onSelect,
  onUpdate,
  currentPage: controlledPage,
  onPageChange,
  searchTerm: controlledSearchTerm,
  onSearchChange,
}) => {
  const [showForm, setShowForm] = useState(false)
  const [internalSearchTerm, setInternalSearchTerm] = useState('')
  const [internalPage, setInternalPage] = useState(1)

  const isPageControlled = controlledPage !== undefined && onPageChange !== undefined
  const isSearchControlled = controlledSearchTerm !== undefined && onSearchChange !== undefined
  const currentPage = isPageControlled ? controlledPage : internalPage
  const setCurrentPage = isPageControlled ? onPageChange! : setInternalPage
  const searchTerm = isSearchControlled ? controlledSearchTerm : internalSearchTerm
  const setSearchTerm = isSearchControlled ? onSearchChange! : setInternalSearchTerm

  useEffect(() => {
    if (!isPageControlled) setInternalPage(1)
  }, [searchTerm, isPageControlled])

  const createMutation = useCreateAssignment()
  const { data: paginated, isLoading: assignmentsLoading } = useAssignmentsPaginated(
    currentPage,
    searchTerm ?? '',
  )
  const assignments = paginated?.data ?? []
  const totalAssignments = paginated?.total ?? 0

  const handleCreate = async (data: CreateAssignmentData) => {
    try {
      await createMutation.mutateAsync(data)
      setShowForm(false)
      onUpdate()
    } catch (error) {
      console.error('Error creating assignment:', error)
      alert('Failed to create assignment')
    }
  }

  return (
    <AssignmentListUI
      assignments={assignments}
      isLoading={assignmentsLoading}
      selectedId={selectedId}
      onSelect={onSelect}
      showForm={showForm}
      onShowForm={() => setShowForm(true)}
      onHideForm={() => setShowForm(false)}
      onCreate={handleCreate}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      pagination={{
        current: currentPage,
        total: totalAssignments,
        pageSize: ASSIGNMENTS_PER_PAGE,
        onChange: setCurrentPage,
      }}
    />
  )
}

export default AssignmentList
