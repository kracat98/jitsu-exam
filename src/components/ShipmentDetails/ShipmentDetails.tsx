import { useState, useEffect, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Layout, Typography, Button, Space, Descriptions, Modal, Input, Select, Form } from 'antd'
import { useUpdateShipment, useDeleteShipment } from '../../hooks/useShipments'
import { StatusBadge } from '../shared/StatusBadge'
import ShipmentMap from '../ShipmentMap/ShipmentMap'
import type { Shipment, Assignment, Status, ShipmentFormData } from '../../types'

const { Header, Content } = Layout
const { Title } = Typography
const { Option } = Select

interface ShipmentDetailsProps {
  shipment: Shipment
  statuses: Status[]
  assignments: Assignment[]
  onUpdate: (shipment: Shipment) => void
  onDelete: (id: string) => void
  showMapWithAllShipments?: boolean
  allShipments?: Shipment[] | null
}

const formatDate = (dateString: string, locale: string): string => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const ShipmentDetails: React.FC<ShipmentDetailsProps> = memo(({
  shipment,
  statuses,
  assignments,
  onUpdate,
  onDelete,
  showMapWithAllShipments = false,
  allShipments = null,
}) => {
  const { t, i18n } = useTranslation()
  const [form] = Form.useForm()
  const [formData, setFormData] = useState<ShipmentFormData>({
    status: shipment.status,
    assignment_id: shipment.assignment_id || '',
    delivery_by_date: shipment.delivery_by_date
      ? new Date(shipment.delivery_by_date).toISOString().split('T')[0]
      : '',
    lat: shipment.lat?.toString() || '',
    lng: shipment.lng?.toString() || '',
  })
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const updateMutation = useUpdateShipment()
  const deleteMutation = useDeleteShipment()

  useEffect(() => {
    setFormData({
      status: shipment.status,
      assignment_id: shipment.assignment_id || '',
      delivery_by_date: shipment.delivery_by_date
        ? new Date(shipment.delivery_by_date).toISOString().split('T')[0]
        : '',
      lat: shipment.lat?.toString() || '',
      lng: shipment.lng?.toString() || '',
    })
    form.setFieldsValue({
      status: shipment.status,
      assignment_id: shipment.assignment_id || '',
      delivery_by_date: shipment.delivery_by_date
        ? new Date(shipment.delivery_by_date).toISOString().split('T')[0]
        : '',
      lat: shipment.lat?.toString() || '',
      lng: shipment.lng?.toString() || '',
    })
    setIsEditing(false)
  }, [shipment, form])

  const handleStatusChange = (value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, status: value, assignment_id: value === 'OPEN' ? '' : prev.assignment_id }
      form.setFieldsValue({ assignment_id: value === 'OPEN' ? undefined : newData.assignment_id })
      return newData
    })
  }

  const handleSave = async () => {
    try {
      const values = form.getFieldsValue()
      const updatedShipment: Partial<Shipment> = {
        ...shipment,
        status: values.status as Shipment['status'],
        assignment_id: values.status === 'OPEN' ? undefined : (values.assignment_id || undefined),
        delivery_by_date: values.delivery_by_date
          ? new Date(values.delivery_by_date).toISOString()
          : shipment.delivery_by_date,
        lat: values.lat ? parseFloat(values.lat) : shipment.lat,
        lng: values.lng ? parseFloat(values.lng) : shipment.lng,
      }

      if (
        (updatedShipment.status === 'IN_TRANSIT' || updatedShipment.status === 'DELIVERED') &&
        !updatedShipment.assignment_id
      ) {
        Modal.error({
          title: t('shipments.details.assignmentRequired'),
        })
        return
      }

      await updateMutation.mutateAsync({ id: shipment.id, data: updatedShipment })
      onUpdate({ ...shipment, ...updatedShipment } as Shipment)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating shipment:', error)
      Modal.error({
        title: t('shipments.details.updateError'),
      })
    }
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(shipment.id)
      onDelete(shipment.id)
      setShowDeleteConfirm(false)
    } catch (error) {
      console.error('Error deleting shipment:', error)
      Modal.error({
        title: t('shipments.details.deleteError'),
      })
    }
  }

  const showDeleteModal = () => {
    Modal.confirm({
      title: t('shipments.details.deleteConfirm'),
      okText: t('shipments.details.yesDelete'),
      okType: 'danger',
      cancelText: t('common.cancel'),
      onOk: handleDelete,
    })
  }

  const requiresAssignment = formData.status === 'IN_TRANSIT' || formData.status === 'DELIVERED'
  const hasCurrentShipmentCoords = shipment.lat && shipment.lng
  const hasOtherShipmentsWithCoords = showMapWithAllShipments &&
    allShipments &&
    allShipments.length > 0 &&
    allShipments.some(s => s.lat && s.lng)

  return (
    <Layout style={{ height: '100%', background: '#fff' }}>
      <Header
        style={{
          background: '#f8f9fa',
          borderBottom: '1px solid #f0f0f0',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          {t('shipments.details.title')}
        </Title>
        <Space>
          {!isEditing ? (
            <>
              <Button onClick={() => setIsEditing(true)}>{t('common.edit')}</Button>
              <Button danger onClick={showDeleteModal}>
                {t('common.delete')}
              </Button>
            </>
          ) : (
            <>
              <Button type="primary" onClick={handleSave}>
                {t('common.save')}
              </Button>
              <Button onClick={() => setIsEditing(false)}>
                {t('common.cancel')}
              </Button>
            </>
          )}
        </Space>
      </Header>

      <Content style={{ overflow: 'auto', padding: '24px' }}>
        {isEditing ? (
          <Form form={form} layout="vertical">
            <Descriptions column={1} bordered>
              <Descriptions.Item label={t('shipments.details.clientName')}>
                {shipment.client_name}
              </Descriptions.Item>
              <Descriptions.Item label={t('shipments.details.label')}>
                {shipment.label}
              </Descriptions.Item>
              <Descriptions.Item label={t('shipments.details.status')}>
                <Form.Item name="status" style={{ margin: 0 }}>
                  <Select onChange={handleStatusChange}>
                    {statuses.map((status) => (
                      <Option key={status.id} value={status.id}>
                        {t(`shipments.status.${status.id.toLowerCase()}`)}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label={t('shipments.details.arrivalDate')}>
                {formatDate(shipment.arrival_date, i18n.language)}
              </Descriptions.Item>
              <Descriptions.Item label={t('shipments.details.deliveryByDate')}>
                <Form.Item name="delivery_by_date" style={{ margin: 0 }}>
                  <Input type="date" />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label={t('shipments.details.warehouseId')}>
                {shipment.warehouse_id}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    {t('shipments.details.assignmentId')}
                    {formData.status !== 'OPEN' && ' *'}
                  </>
                }
              >
                <Form.Item
                  name="assignment_id"
                  rules={[
                    {
                      required: requiresAssignment,
                      message: t('shipments.details.assignmentRequired'),
                    },
                  ]}
                  style={{ margin: 0 }}
                >
                  <Select disabled={formData.status === 'OPEN'} placeholder={t('common.none')}>
                    <Option value="">{t('common.none')}</Option>
                    {assignments.map((assignment) => (
                      <Option key={assignment.id} value={assignment.id}>
                        {assignment.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label={t('shipments.details.latitude')}>
                <Form.Item name="lat" style={{ margin: 0 }}>
                  <Input type="number" step="any" />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label={t('shipments.details.longitude')}>
                <Form.Item name="lng" style={{ margin: 0 }}>
                  <Input type="number" step="any" />
                </Form.Item>
              </Descriptions.Item>
            </Descriptions>
          </Form>
        ) : (
          <Descriptions column={1} bordered>
            <Descriptions.Item label={t('shipments.details.clientName')}>
              {shipment.client_name}
            </Descriptions.Item>
            <Descriptions.Item label={t('shipments.details.label')}>
              {shipment.label}
            </Descriptions.Item>
            <Descriptions.Item label={t('shipments.details.status')}>
              <StatusBadge status={shipment.status}>
                {t(`shipments.status.${shipment.status.toLowerCase()}`)}
              </StatusBadge>
            </Descriptions.Item>
            <Descriptions.Item label={t('shipments.details.arrivalDate')}>
              {formatDate(shipment.arrival_date, i18n.language)}
            </Descriptions.Item>
            <Descriptions.Item label={t('shipments.details.deliveryByDate')}>
              {formatDate(shipment.delivery_by_date, i18n.language)}
            </Descriptions.Item>
            <Descriptions.Item label={t('shipments.details.warehouseId')}>
              {shipment.warehouse_id}
            </Descriptions.Item>
            <Descriptions.Item label={t('shipments.details.assignmentId')}>
              {shipment.assignment_id || t('common.none')}
            </Descriptions.Item>
          </Descriptions>
        )}

        {(hasCurrentShipmentCoords || hasOtherShipmentsWithCoords) && (
          <Card
            title={t('shipments.details.location')}
            style={{ marginTop: '24px' }}
          >
            <ShipmentMap
              lat={isEditing ? parseFloat(formData.lat) || shipment.lat : shipment.lat}
              lng={isEditing ? parseFloat(formData.lng) || shipment.lng : shipment.lng}
              shipments={showMapWithAllShipments && allShipments ? allShipments : null}
              selectedShipmentId={showMapWithAllShipments ? shipment.id : null}
            />
          </Card>
        )}
      </Content>
    </Layout>
  )
})

ShipmentDetails.displayName = 'ShipmentDetails'

export default ShipmentDetails
