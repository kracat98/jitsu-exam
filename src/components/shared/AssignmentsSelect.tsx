import React, { useRef, useCallback, memo, useState } from 'react'
import { Select, Spin } from 'antd'
import { useAssignmentsInfinite } from '../../hooks'
import type { Assignment } from '../../types'

const DROPDOWN_MAX_HEIGHT = 256
const LOAD_MORE_OFFSET = 50

export interface AssignmentsSelectProps {
  currentValue?: string
  onChange?: (value: string) => void
  disabled?: boolean
  placeholder?: string
  allowClear?: boolean
  /** Label for the empty/none option when value can be cleared (e.g. "None") */
  noneOptionLabel?: string
  /** Option label render - default: assignment.label */
  optionLabel?: (assignment: Assignment) => React.ReactNode
}

const AssignmentsSelect: React.FC<AssignmentsSelectProps> = memo(({
  currentValue,
  onChange,
  disabled = false,
  placeholder,
  allowClear = true,
  noneOptionLabel,
  optionLabel = (a: Assignment) => { return `${a.label} (${a.id})` },
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useAssignmentsInfinite()
  const [value, setValue] = useState<string>(currentValue || '')
  const [open, setOpen] = useState(false)

  const assignments = data?.pages.flatMap((p) => p.data) ?? []

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget
      const { scrollTop, clientHeight, scrollHeight } = el
      if (scrollHeight - scrollTop - clientHeight < LOAD_MORE_OFFSET) {
        loadMore()
      }
    },
    [loadMore],
  )

  const handleSelectOption = useCallback(
    (id: string) => {
      setValue(id)
      onChange?.(id)
      setOpen(false)
    },
    [onChange],
  )

  const handleSelectNone = useCallback(() => {
    setValue('')
    onChange?.('')
    setOpen(false)
  }, [onChange])

  if (isLoading) {
    return (
      <Select
        value={value}
        onChange={setValue}
        disabled={disabled}
        placeholder={placeholder}
        allowClear={allowClear}
        notFoundContent={<Spin size="small" />}
        dropdownStyle={{ minWidth: 200 }}
      />
    )
  }

  return (
    <Select
      value={value}
      onChange={setValue}
      open={open}
      onDropdownVisibleChange={setOpen}
      disabled={disabled}
      placeholder={placeholder}
      allowClear={allowClear}
      listHeight={DROPDOWN_MAX_HEIGHT}
      dropdownRender={() => (
        <div
          ref={scrollContainerRef}
          style={{
            maxHeight: DROPDOWN_MAX_HEIGHT,
            overflow: 'auto',
          }}
          onScroll={handleScroll}
        >
          {noneOptionLabel != null && (
            <div
              key='none'
              aria-selected={value === ''}
              onClick={() => handleSelectNone()}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                backgroundColor: value === '' ? 'var(--ant-color-primary-bg)' : undefined,
              }}
            >
              {noneOptionLabel}
            </div>
          )}
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              aria-selected={value === assignment.id}
              onClick={() => handleSelectOption(assignment.id)}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                backgroundColor: value === assignment.id ? 'var(--ant-color-primary-bg)' : undefined,
              }}
            >
              {optionLabel(assignment)}
            </div>
          ))}
          {isFetchingNextPage && (
            <div style={{ padding: '8px', textAlign: 'center' }}>
              <Spin size="small" />
            </div>
          )}
        </div>
      )}
      dropdownStyle={{ minWidth: 200 }}
      options={[
        ...(noneOptionLabel != null ? [{ value: '', label: noneOptionLabel }] : []),
        ...assignments.map((a) => ({ value: a.id, label: optionLabel(a) })),
        ...(value && !assignments.some((a) => a.id === value)
          ? [{ value, label: value }]
          : []),
      ]}
    >
    </Select>
  )
})

AssignmentsSelect.displayName = 'AssignmentsSelect'

export default AssignmentsSelect
