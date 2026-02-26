import { Input as AntInput, Select as AntSelect } from 'antd'
import type { InputProps } from 'antd/es/input'
import type { SelectProps } from 'antd/es/select'

export const Input: React.FC<InputProps> = (props) => {
  return <AntInput {...props} />
}

export const Select: React.FC<SelectProps> = (props) => {
  return <AntSelect {...props} style={{ width: '100%' }} />
}
