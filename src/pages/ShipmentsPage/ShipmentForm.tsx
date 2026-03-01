import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Form, Input, Select, Button, Space } from 'antd'
import type { CreateShipmentData } from '../../types'
import AssignmentsSelect from '../../components/shared/AssignmentsSelect'

const { Option } = Select

interface ShipmentFormProps {
  onSave: (data: CreateShipmentData) => void
  onCancel: () => void
}

const ShipmentForm: React.FC<ShipmentFormProps> = ({ onSave, onCancel }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [formData, setFormData] = useState({
    client_name: '',
    label: '',
    status: 'OPEN',
    arrival_date: new Date().toISOString().split('T')[0],
    delivery_by_date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    warehouse_id: '581',
    assignment_id: '',
    lat: '',
    lng: '',
  })

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value,
      assignment_id: value === 'OPEN' ? '' : prev.assignment_id,
    }))
    form.setFieldsValue({ assignment_id: value === 'OPEN' ? undefined : formData.assignment_id })
  }

  const handleFinish = () => {
    const values = form.getFieldsValue()

    // Validate: assignment_id is required for IN_TRANSIT and DELIVERED
    if (
      (values.status === 'IN_TRANSIT' || values.status === 'DELIVERED') &&
      !values.assignment_id
    ) {
      form.setFields([{ name: 'assignment_id', errors: [t('shipments.details.assignmentRequired')] }])
      return
    }

    const newShipment: CreateShipmentData = {
      ...values,
      status: values.status as 'OPEN' | 'IN_TRANSIT' | 'DELIVERED',
      arrival_date: new Date(values.arrival_date).toISOString(),
      delivery_by_date: new Date(values.delivery_by_date).toISOString(),
      assignment_id: values.assignment_id || undefined,
      lat: values.lat ? parseFloat(values.lat) : 37.50625872839932,
      lng: values.lng ? parseFloat(values.lng) : -122.27532417589653,
    }
    onSave(newShipment)
    form.resetFields()
  }

  return (
    <Modal
      title={t('shipments.form.title')}
      open={true}
      onCancel={onCancel}
      footer={null}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={formData}
        onFinish={handleFinish}
      >
        <Form.Item
          name="client_name"
          label={t('shipments.form.clientName')}
          rules={[{ required: true, message: t('shipments.form.clientName') + ' is required' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="label"
          label={t('shipments.form.label')}
          rules={[{ required: true, message: t('shipments.form.label') + ' is required' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="status"
          label={t('shipments.form.status')}
          rules={[{ required: true }]}
        >
          <Select onChange={handleStatusChange}>
            <Option value="OPEN">{t('shipments.status.open')}</Option>
            <Option value="IN_TRANSIT">{t('shipments.status.in_transit')}</Option>
            <Option value="DELIVERED">{t('shipments.status.delivered')}</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="arrival_date"
          label={t('shipments.form.arrivalDate')}
          rules={[{ required: true }]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item
          name="delivery_by_date"
          label={t('shipments.form.deliveryByDate')}
          rules={[{ required: true }]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item
          name="warehouse_id"
          label={t('shipments.form.warehouseId')}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="assignment_id"
          label={
            <>
              {t('shipments.details.assignmentId')}
              {form.getFieldValue('status') !== 'OPEN' && ' *'}
            </>
          }
          rules={[
            {
              required: form.getFieldValue('status') !== 'OPEN',
              message: t('shipments.details.assignmentRequired'),
            },
          ]}
        >
          <AssignmentsSelect
            currentValue={''}
            onChange={(value: string) => {
              setFormData((prev) => {
                const newData = { ...prev, assignment_id: value }
                form.setFieldsValue({ assignment_id: newData.assignment_id })
                return newData
              })
            }}
            disabled={formData.status === 'OPEN'}
            placeholder={t('common.none')}
            noneOptionLabel={t('common.none')}
            allowClear
          />
        </Form.Item>

        <Form.Item name="lat" label={t('shipments.form.latitude')}>
          <Input type="number" step="any" placeholder="37.50625872839932" />
        </Form.Item>

        <Form.Item name="lng" label={t('shipments.form.longitude')}>
          <Input type="number" step="any" placeholder="-122.27532417589653" />
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

export default ShipmentForm
