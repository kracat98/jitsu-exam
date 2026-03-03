import { useTranslation } from 'react-i18next'
import { Modal, Form, Input, Select, Button, Space, Typography } from 'antd'
import type { CreateAssignmentData } from '../../types'
import { useState } from 'react'
import { useCreateAssignment } from '../../hooks'

const { Option } = Select
const { Title } = Typography

interface AssignmentFormProps {
  // onSave: (data: CreateAssignmentData) => void
  // onCancel: () => void
}

const AssignmentForm: React.FC<AssignmentFormProps> = () => {
  const { t } = useTranslation()
  const [showForm, setShowForm] = useState(false)
  const [form] = Form.useForm()
  const createMutation = useCreateAssignment()

  const handleCreate = async (data: CreateAssignmentData) => {
    try {
      await createMutation.mutateAsync(data)
      setShowForm(false)
    } catch (error) {
      console.error('Error creating assignment:', error)
      alert('Failed to create assignment')
    }
  }

  const handleFinish = () => {
    const values = form.getFieldsValue()
    const newAssignment: CreateAssignmentData = {
      label: values.label,
      status: values.status as 'OPEN' | 'IN_TRANSIT' | 'DELIVERED',
      clients: values.clients
        ? values.clients.split(',').map((c: string) => c.trim()).filter((c: string) => c)
        : [],
    }
    handleCreate(newAssignment)
    form.resetFields()
  }

  return (
    <>
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>
            {t('assignments.list.title')}
          </Title>
          <Button type="primary" onClick={() => setShowForm(true)}>
            {t('assignments.list.newButton')}
          </Button>
        </div>
      </Space>
      {showForm && <Modal
        title={t('assignments.form.title')}
        open={true}
        onCancel={() => setShowForm(false)}
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
              <Button onClick={() => setShowForm(false)}>{t('common.cancel')}</Button>
              <Button type="primary" htmlType="submit">
                {t('common.create')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>}
    </>
  )
}

export default AssignmentForm
