import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Layout, Menu, Select, Space } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import ShipmentsPage from './pages/ShipmentsPage'
import AssignmentsPage from './pages/AssignmentsPage'

const { Header, Content } = Layout

function AppContent() {
  const { t, i18n } = useTranslation()
  const location = useLocation()

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value)
  }

  const menuItems = [
    {
      key: '/shipments',
      label: <Link to="/shipments">{t('nav.shipments')}</Link>,
    },
    {
      key: '/assignments',
      label: <Link to="/assignments">{t('nav.assignments')}</Link>,
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#2c3e50',
          padding: '0 24px',
        }}
      >
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none' }}
        />
        <Space>
          <Select
            value={i18n.language}
            onChange={handleLanguageChange}
            style={{ width: 120 }}
            options={[
              { value: 'en', label: t('language.english') },
              { value: 'vi', label: t('language.vietnamese') },
            ]}
          />
        </Space>
      </Header>
      <Content style={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
        <Routes>
          <Route path="/shipments" element={<ShipmentsPage />} />
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/" element={<ShipmentsPage />} />
        </Routes>
      </Content>
    </Layout>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
