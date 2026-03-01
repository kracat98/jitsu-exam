import { Button as AntButton, ButtonProps } from 'antd'

interface CustomButtonProps extends Omit<ButtonProps, 'type' | 'variant'> {
  variant?: 'primary' | 'danger' | 'secondary'
}

export const Button: React.FC<CustomButtonProps> = ({ variant = 'primary', ...props }) => {
  let buttonType: ButtonProps['type'] = 'default'
  let danger = false

  if (variant === 'primary') {
    buttonType = 'primary'
  } else if (variant === 'danger') {
    danger = true
    buttonType = 'primary'
  } else if (variant === 'secondary') {
    buttonType = 'default'
  }

  return <AntButton type={buttonType} danger={danger} {...props} />
}
