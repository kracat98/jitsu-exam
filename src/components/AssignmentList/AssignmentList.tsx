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
}

const AssignmentList: React.FC<AssignmentListProps> = ({
  selectedId,
  onSelect,
  onUpdate,
}) => {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const createMutation = useCreateAssignment()
  const { data: paginated, isLoading: assignmentsLoading } = useAssignmentsPaginated(
    currentPage ?? 1,
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
