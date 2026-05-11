import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, DatePicker } from 'antd';
import dayjs from 'dayjs';
import {
  DashboardOutlined,
  FormOutlined,
  UploadOutlined,
  BellOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import Dashboard from './pages/Dashboard';
import ExcelUpload from './pages/ExcelUpload';
import Admin from './pages/Admin';
import { DataProvider, useDashboard } from './context/DataContext';

const { Header, Content, Sider } = Layout;

const AppContent = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { dashboardData, allData, selectedDate, setSelectedDate } = useDashboard();

  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: <Link to="/"><div style={{lineHeight: '1.2'}}><div style={{fontSize: 14}}>Bảng điều khiển</div><div style={{fontSize: 11, color: '#888'}}>Dashboard</div></div></Link> },
    { key: '/upload', icon: <UploadOutlined />, label: <Link to="/upload"><div style={{lineHeight: '1.2'}}><div style={{fontSize: 14}}>Quản lý dữ liệu</div><div style={{fontSize: 11, color: '#888'}}>Data Manager</div></div></Link> },
    { key: '/admin', icon: <SettingOutlined />, label: <Link to="/admin"><div style={{lineHeight: '1.2'}}><div style={{fontSize: 14}}>Quản trị</div><div style={{fontSize: 11, color: '#888'}}>Admin</div></div></Link> },
  ];

  const availableDates = Object.keys(allData).sort();

  // Lấy cảnh báo critical mới nhất để chạy trên Marquee
  const autoCriticalAlerts = (dashboardData.csResponse || [])
    .filter(r => (r.responseTime || 0) > (dashboardData.cauHinh?.csResponseMax || 5))
    .map(r => ({ message: `CS Response ${r.responseTime} phút (> ${dashboardData.cauHinh?.csResponseMax || 5})` }));

  const manualCriticalAlerts = (dashboardData.alertsLog || []).filter(a => a.type?.toUpperCase() === 'CRITICAL');
  const allCriticalAlerts = [...manualCriticalAlerts, ...autoCriticalAlerts];
  const marqueeText = allCriticalAlerts.map(a => a.message).join('  |  ');

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} theme="light">
        <div style={{ height: 32, margin: 16, background: 'rgba(0, 0, 0, 0.2)', borderRadius: 6 }} />
        <Menu theme="light" defaultSelectedKeys={[location.pathname]} mode="inline" items={menuItems} />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, color: '#1890ff', fontWeight: 'bold' }}>O2O EXECUTIVE DASHBOARD</h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ lineHeight: '1.2', textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: '500' }}>Chọn ngày xem:</div>
              <div style={{ fontSize: 11, color: '#888' }}>Select Date:</div>
            </div>
            <DatePicker 
              value={dayjs(selectedDate)} 
              onChange={(date, dateString) => setSelectedDate(dateString)}
              style={{ width: 150 }}
              allowClear={false}
              format="YYYY-MM-DD"
            />
          </div>
        </Header>
        
        {/* Alert Marquee */}
        {marqueeText && (
          <div className="marquee-container">
            <div className="marquee-content">
              <span style={{ color: 'red', fontWeight: 'bold', marginRight: 8 }}>[CRITICAL ALERT]</span>
              {marqueeText}
            </div>
          </div>
        )}

        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: '#fff', borderRadius: 8 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/upload" element={<ExcelUpload />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

export default App;
