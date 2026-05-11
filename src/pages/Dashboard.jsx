import React, { useState } from 'react';
import { Row, Col, Modal } from 'antd';
import ZoneOnline from '../components/ZoneOnline';
import ZoneLogistics from '../components/ZoneLogistics';
import ZoneOffline from '../components/ZoneOffline';
import CustomCharts from '../components/CustomCharts';
import { useDashboard } from '../context/DataContext';

const Dashboard = () => {
  const { dashboardData, updateAllData, allData, selectedDate } = useDashboard();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  const openModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setModalVisible(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Row gutter={[16, 16]} style={{ flex: 1 }}>
        {/* Cột 1: Zone A */}
        <Col xs={24} lg={8}>
          <div className="section-title">
            ZONE A: HIỆU QUẢ TRỰC TUYẾN<br/>
            <small style={{ fontWeight: 'normal', color: '#888', fontSize: 12 }}>ONLINE PERFORMANCE</small>
          </div>
          <ZoneOnline data={dashboardData} onEnlarge={openModal} />
        </Col>

        {/* Cột 2: Zone B */}
        <Col xs={24} lg={8}>
          <div className="section-title">
            ZONE B: VẬN HÀNH & TỒN KHO<br/>
            <small style={{ fontWeight: 'normal', color: '#888', fontSize: 12 }}>LOGISTICS & INVENTORY</small>
          </div>
          <ZoneLogistics data={dashboardData} onEnlarge={openModal} />
        </Col>

        {/* Cột 3: Zone C */}
        <Col xs={24} lg={8}>
          <div className="section-title">
            ZONE C: NGOẠI TUYẾN & O2O<br/>
            <small style={{ fontWeight: 'normal', color: '#888', fontSize: 12 }}>OFFLINE & O2O</small>
          </div>
          <ZoneOffline data={dashboardData} onEnlarge={openModal} />
        </Col>
      </Row>

      <CustomCharts 
        dashboardData={dashboardData} 
        updateAllData={updateAllData} 
        allData={allData} 
        selectedDate={selectedDate} 
      />

      <Modal
        title={modalTitle}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
        centered
        bodyStyle={{ height: '500px', padding: '20px' }}
      >
        {modalContent}
      </Modal>
    </div>
  );
};

export default Dashboard;
