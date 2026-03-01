import { Empty, Layout } from 'antd'
import { useAssignmentsInformation } from '../../hooks/useAssignmentsInformation'
import ShipmentDetails from '../ShipmentsPage/ShipmentDetails'
import AssignmentDetails from './AssignmentDetails'
import AssignmentList from './AssignmentList'
import { useTranslation } from 'react-i18next'

const { Content, Sider } = Layout

const AssignmentsPage: React.FC = () => {
  const { t } = useTranslation()
  const { selectedAssignment, selectedShipment } = useAssignmentsInformation()

  return (
    <Layout style={{ height: '100%' }}>
      <Content style={{ display: 'flex', height: 'calc(100% - 64px)' }}>
        <Sider
          width="30%"
          style={{
            background: '#fff',
            borderRight: '1px solid #f0f0f0',
            overflow: 'auto',
          }}
        >
          <AssignmentList onUpdate={() => { }} />
        </Sider>
        <Sider
          width="35%"
          style={{
            background: '#fafafa',
            borderRight: '1px solid #f0f0f0',
            overflow: 'auto',
          }}
        >
          {selectedAssignment ? (
            <AssignmentDetails
              assignment={selectedAssignment}
            />
          ) : (
            <Empty description={t('assignments.selectToView')} style={{ marginTop: '50%' }} />
          )}
        </Sider>
        <Content
          style={{
            width: '35%',
            background: '#fff',
            overflow: 'auto',
            padding: '24px',
          }}
        >
          {selectedShipment ? (
            <ShipmentDetails
              shipment={selectedShipment}
              showMapWithAllShipments={true}
              assignmentId={selectedAssignment?.id}
            />
          ) : (
            <Empty description={t('assignments.selectShipmentToView')} />
          )}
        </Content>
      </Content>
    </Layout>
  )
}

export default AssignmentsPage
