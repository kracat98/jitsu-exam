import { useTranslation } from 'react-i18next'
import { Modal, Form, Input, Select, Button, Space } from 'antd'
import type { CreateAssignmentData } from '../../types'

const { Option } = Select

interface AssignmentFormProps {
  onSave: (data: CreateAssignmentData) => void
  onCancel: () => void
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({ onSave, onCancel }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()

  const handleFinish = () => {
    const values = form.getFieldsValue()
    const newAssignment: CreateAssignmentData = {
      label: values.label,
      status: values.status as 'OPEN' | 'IN_TRANSIT' | 'DELIVERED',
      clients: values.clients
        ? values.clients.split(',').map((c: string) => c.trim()).filter((c: string) => c)
        : [],
    }
    onSave(newAssignment)
    form.resetFields()
  }

  return (
    <Modal
      title={t('assignments.form.title')}
      open={true}
      onCancel={onCancel}
      footer={null}
      width={400}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          name="label"
          label={t('assignments.form.label')}
          rules={[{ required: true, message: t('assignments.form.label') + ' is required' }]}
        >
          <Input placeholder={t('assignments.form.labelPlaceholder')} />
        </Form.Item>

        <Form.Item
          name="status"
          label={t('assignments.form.status')}
          rules={[{ required: true }]}
        >
          <Select>
            <Option value="OPEN">{t('assignments.status.open')}</Option>
            <Option value="IN_TRANSIT">{t('assignments.status.in_transit')}</Option>
            <Option value="DELIVERED">{t('assignments.status.delivered')}</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="clients"
          label={t('assignments.form.clients')}
        >
          <Input placeholder={t('assignments.form.clientsPlaceholder')} />
        </Form.Item>

        <Form.Item>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={onCancel}>{t('common.cancel')}</Button>
            <Button type="primary" htmlType="submit">
              {t('common.create')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AssignmentForm
