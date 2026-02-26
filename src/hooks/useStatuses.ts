import { useQuery } from '@tanstack/react-query'
import { getStatuses } from '../services/api'

export const useStatuses = () => {
  return useQuery({
    queryKey: ['statuses'],
    queryFn: getStatuses,
  })
}
