import React from 'react';
import { Card, Table, Tag, Typography, Space, Badge } from 'antd';
import { useDashboard } from '../context/DataContext';

const { Title } = Typography;

const AlertCenter = () => {
  const { dashboardData } = useDashboard();

  const getColTitle = (vi, en) => (
    <div style={{ lineHeight: '1.2' }}>
      <div>{vi}</div>
      <div style={{ fontSize: 10, color: '#888', fontWeight: 'normal' }}>{en}</div>
    </div>
  );

  const columns = [
    {
      title: getColTitle('Mức độ', 'Severity'),
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        let color = 'blue';
        let text = 'Thông tin / Info';
        if (type === 'critical') { color = 'red'; text = 'Khẩn cấp / Critical'; }
        if (type === 'warning') { color = 'orange'; text = 'Cảnh báo / Warning'; }
        return <Tag color={color}>{text.toUpperCase()}</Tag>;
      },
      filters: [
        { text: 'Khẩn cấp / Critical', value: 'critical' },
        { text: 'Cảnh báo / Warning', value: 'warning' },
        { text: 'Thông tin / Info', value: 'info' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: getColTitle('Thông báo', 'Message'),
      dataIndex: 'message',
      key: 'message',
      render: (text, record) => (
        <Space>
          {record.type === 'critical' && <Badge status="error" />}
          {text}
        </Space>
      ),
    },
    {
      title: getColTitle('Thời gian', 'Time'),
      dataIndex: 'time',
      key: 'time',
      sorter: (a, b) => a.time.localeCompare(b.time),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Card title={<Title level={3} style={{ lineHeight: 1.2, margin: 0 }}>Trung Tâm Cảnh Báo<br/><span style={{fontSize: 14, color: '#888', fontWeight: 'normal'}}>Alert Center</span></Title>} className="glass-card">
        <Table 
          dataSource={dashboardData.alerts} 
          columns={columns} 
          rowKey="id" 
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default AlertCenter;
