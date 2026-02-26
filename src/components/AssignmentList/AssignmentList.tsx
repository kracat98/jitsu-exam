import { useState } from 'react'
import { useCreateAssignment } from '../../hooks/useAssignments'
import AssignmentListUI from './AssignmentListUI'
import type { Assignment, CreateAssignmentData } from '../../types'

interface AssignmentListProps {
  assignments: Assignment[]
  selectedId?: string
  onSelect: (assignment: Assignment) => void
  onUpdate: () => void
  searchTerm: string
  onSearchChange: (value: string) => void
}

const AssignmentList: React.FC<AssignmentListProps> = ({
  assignments,
  selectedId,
  onSelect,
  onUpdate,
  searchTerm,
  onSearchChange,
}) => {
  const [showForm, setShowForm] = useState(false)
  const createMutation = useCreateAssignment()

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
      selectedId={selectedId}
      onSelect={onSelect}
      showForm={showForm}
      onShowForm={() => setShowForm(true)}
      onHideForm={() => setShowForm(false)}
      onCreate={handleCreate}
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
    />
  )
}

export default AssignmentList
