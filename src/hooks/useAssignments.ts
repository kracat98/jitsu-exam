import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAssignments, getAssignment, createAssignment, updateAssignment, deleteAssignment } from '../services/api'
import type { CreateAssignmentData } from '../types'

export const useAssignments = () => {
  return useQuery({
    queryKey: ['assignments'],
    queryFn: getAssignments,
  })
}

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
