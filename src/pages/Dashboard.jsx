import React, { useState } from 'react';
import { Row, Col, Modal, Button } from 'antd';
import ZoneOnline from '../components/ZoneOnline';
import ZoneLogistics from '../components/ZoneLogistics';
import ZoneOffline from '../components/ZoneOffline';
import CustomChartModal from '../components/CustomChartModal';
import { useDashboard } from '../context/DataContext';

const Dashboard = () => {
  const { dashboardData, updateAllData, allData, selectedDate } = useDashboard();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [chartModalOpen, setChartModalOpen] = useState(false);
  const [targetZone, setTargetZone] = useState('');

  const openChartModal = (zone) => {
    setTargetZone(zone);
    setChartModalOpen(true);
  };

  const handleDeleteChart = (id) => {
    const currentCharts = Array.isArray(dashboardData?.customCharts) ? dashboardData.customCharts : [];
    const updatedCharts = currentCharts.filter(c => c.id !== id);
    const newDataByDate = { 
      ...allData, 
      [selectedDate]: { ...dashboardData, customCharts: updatedCharts } 
    };
    updateAllData(newDataByDate);
  };

  const getCustomCharts = (zone) => {
    return Array.isArray(dashboardData?.customCharts) 
      ? dashboardData.customCharts.filter(c => c.zone === zone) 
      : [];
  };

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
          <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              ZONE A: HIỆU QUẢ TRỰC TUYẾN<br/>
              <small style={{ fontWeight: 'normal', color: '#888', fontSize: 12 }}>ONLINE PERFORMANCE</small>
            </div>
            <Button size="small" type="dashed" onClick={() => openChartModal('A')}>+ Biểu Đồ</Button>
          </div>
          <ZoneOnline data={dashboardData} onEnlarge={openModal} customCharts={getCustomCharts('A')} onDeleteChart={handleDeleteChart} />
        </Col>

        {/* Cột 2: Zone B */}
        <Col xs={24} lg={8}>
          <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              ZONE B: VẬN HÀNH & TỒN KHO<br/>
              <small style={{ fontWeight: 'normal', color: '#888', fontSize: 12 }}>LOGISTICS & INVENTORY</small>
            </div>
            <Button size="small" type="dashed" onClick={() => openChartModal('B')}>+ Biểu Đồ</Button>
          </div>
          <ZoneLogistics data={dashboardData} onEnlarge={openModal} customCharts={getCustomCharts('B')} onDeleteChart={handleDeleteChart} />
        </Col>

        {/* Cột 3: Zone C */}
        <Col xs={24} lg={8}>
          <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              ZONE C: NGOẠI TUYẾN & O2O<br/>
              <small style={{ fontWeight: 'normal', color: '#888', fontSize: 12 }}>OFFLINE & O2O</small>
            </div>
            <Button size="small" type="dashed" onClick={() => openChartModal('C')}>+ Biểu Đồ</Button>
          </div>
          <ZoneOffline data={dashboardData} onEnlarge={openModal} customCharts={getCustomCharts('C')} onDeleteChart={handleDeleteChart} />
        </Col>
      </Row>

      <CustomChartModal 
        open={chartModalOpen} 
        onCancel={() => setChartModalOpen(false)} 
        targetZone={targetZone} 
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
