import React from 'react';
import { Card, Descriptions, Badge, Switch, Slider, Typography, Row, Col, Statistic, Divider } from 'antd';
import { SettingOutlined, SafetyCertificateOutlined, ThunderboltOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Admin = () => {
  const getColTitle = (vi, en) => (
    <div style={{ lineHeight: '1.2' }}>
      <div>{vi}</div>
      <div style={{ fontSize: 10, color: '#888', fontWeight: 'normal' }}>{en}</div>
    </div>
  );

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title={<div style={{display: 'flex', alignItems: 'center'}}><SettingOutlined style={{marginRight: 8}} /> <div style={{ lineHeight: '1.2' }}><div>Cấu hình Hệ thống Dashboard</div><div style={{ fontSize: 12, color: '#888', fontWeight: 'normal' }}>Dashboard System Configuration</div></div></div>} className="glass-card">
            <Row gutter={24}>
              <Col span={8}>
                <Statistic title={getColTitle('Trạng thái Hệ thống', 'System Status')} value="Hoạt động / Active" valueStyle={{ color: '#3f8600' }} prefix={<SafetyCertificateOutlined />} />
              </Col>
              <Col span={8}>
                <Statistic title={getColTitle('Thời gian chạy (Uptime)', 'Uptime')} value="14 ngày / days" prefix={<ThunderboltOutlined />} />
              </Col>
              <Col span={8}>
                <Statistic title={getColTitle('Phiên bản', 'Version')} value="v1.2.0" />
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<div style={{ lineHeight: '1.2' }}><div>Ngưỡng Cảnh Báo</div><div style={{ fontSize: 12, color: '#888', fontWeight: 'normal' }}>Alert Thresholds</div></div>} className="glass-card">
            <div style={{ marginBottom: 20 }}>
              <Text strong>Target ROAS (Min)</Text>
              <Slider defaultValue={5.5} min={1} max={10} step={0.1} marks={{ 5.5: 'Mặc định / Default' }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <Text strong>Tỷ lệ Huỷ đơn tối đa (%) / Max Cancel Rate</Text>
              <Slider defaultValue={10} min={0} max={30} step={1} marks={{ 10: 'Cảnh báo / Alert' }} />
            </div>
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<div style={{ lineHeight: '1.2' }}><div>Quản lý Thông báo</div><div style={{ fontSize: 12, color: '#888', fontWeight: 'normal' }}>Notification Management</div></div>} className="glass-card">
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label={getColTitle('Gửi thông báo qua Zalo', 'Send Zalo notification')}>
                <Switch defaultChecked />
              </Descriptions.Item>
              <Descriptions.Item label={getColTitle('Gửi báo cáo qua Email hàng ngày', 'Send daily Email report')}>
                <Switch defaultChecked />
              </Descriptions.Item>
              <Descriptions.Item label={getColTitle('Tự động cập nhật từ Warehouse', 'Auto update from Warehouse')}>
                <Switch />
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Admin;
