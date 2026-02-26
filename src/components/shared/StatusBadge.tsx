import { Tag } from 'antd'
import type { TagProps } from 'antd/es/tag'

interface StatusBadgeProps {
  status: 'OPEN' | 'IN_TRANSIT' | 'DELIVERED'
  children: React.ReactNode
}

const statusColors: Record<string, TagProps['color']> = {
  open: 'success',
  in_transit: 'warning',
  delivered: 'processing',
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, children }) => {
  const color = statusColors[status.toLowerCase()] || 'default'
  
  return (
    <Tag color={color} style={{ textTransform: 'uppercase', fontWeight: 600 }}>
      {children}
    </Tag>
  )
}
