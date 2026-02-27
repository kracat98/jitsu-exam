import React, { useState, useEffect, useRef, useCallback, memo } from 'react'
import { Input } from 'antd'

const DEFAULT_DEBOUNCE_MS = 300

export interface SearchProps {
  value: string
  onSearchChange: (value: string) => void
  placeholder?: string
  debounceMs?: number
  allowClear?: boolean
}

const Search: React.FC<SearchProps> = memo(({
  value,
  onSearchChange,
  placeholder,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  allowClear = true,
}) => {
  const [localValue, setLocalValue] = useState(value)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const flushDebounce = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value
      setLocalValue(next)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null
        onSearchChange(next)
      }, debounceMs)
    },
    [onSearchChange, debounceMs],
  )

  const handleSearch = useCallback(
    (val: string) => {
      flushDebounce()
      setLocalValue(val)
      onSearchChange(val)
    },
    [flushDebounce, onSearchChange],
  )

  return (
    <Input.Search
      placeholder={placeholder}
      value={localValue}
      onChange={handleChange}
      onSearch={handleSearch}
      allowClear={allowClear}
    />
  )
})

Search.displayName = 'Search'

export default Search
