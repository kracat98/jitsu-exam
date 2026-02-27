import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAssignments,
  getAssignmentsPaginated,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from '../services/api'
import type { CreateAssignmentData } from '../types'

const ASSIGNMENTS_PER_PAGE = 5

export const useAssignments = () => {
  return useQuery({
    queryKey: ['assignments'],
    queryFn: getAssignments,
  })
}

export const useAssignmentsPaginated = (page: number = 1, searchTerm?: string) => {
  return useQuery({
    queryKey: ['assignments', 'paginated', page, searchTerm ?? ''],
    queryFn: () => getAssignmentsPaginated(page, ASSIGNMENTS_PER_PAGE, searchTerm),
  })
}

export { ASSIGNMENTS_PER_PAGE }

export const useAssignment = (id: string | undefined) => {
  return useQuery({
    queryKey: ['assignments', id],
    queryFn: () => getAssignment(id!),
    enabled: !!id,
  })
}

export const useCreateAssignment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateAssignmentData) => createAssignment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] })
    },
  })
}

export const useUpdateAssignment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateAssignmentData> }) =>
      updateAssignment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] })
    },
  })
}

export const useDeleteAssignment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => deleteAssignment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] })
    },
  })
}
