import React, { useState } from 'react';
import { Card, Button, Modal, Form, Select, Input, Row, Col, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const { Title } = Typography;

const TAB_MAP = [
  { key: 'onlineGmv', name: '03_Online_GMV' },
  { key: 'onlineRoas', name: '04_Online_ROAS' },
  { key: 'adsConversion', name: '05_Ads_Conversion' },
  { key: 'inventorySku', name: '06_Inventory_SKU' },
  { key: 'stockSafety', name: '07_Stock_Safety' },
  { key: 'orderStatus', name: '08_Order_Status' },
  { key: 'offlineTraffic', name: '09_Offline_Traffic' },
  { key: 'offlineSales', name: '10_Offline_Sales' },
  { key: 'skuSampling', name: '11_SKU_Sampling' },
  { key: 'csResponse', name: '12_CS_Response' },
];

const CustomCharts = ({ dashboardData, updateAllData, allData, selectedDate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  
  const customCharts = dashboardData?.customCharts || [];
  
  const handleSaveChart = (values) => {
    const newChart = {
      id: Date.now().toString(),
      ...values
    };
    
    const updatedCharts = [...customCharts, newChart];
    const newDataByDate = { 
      ...allData, 
      [selectedDate]: { ...dashboardData, customCharts: updatedCharts } 
    };
    
    updateAllData(newDataByDate);
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDeleteChart = (id) => {
    const updatedCharts = customCharts.filter(c => c.id !== id);
    const newDataByDate = { 
      ...allData, 
      [selectedDate]: { ...dashboardData, customCharts: updatedCharts } 
    };
    updateAllData(newDataByDate);
  };

  const getAvailableColumns = (sheetKey) => {
    if (!sheetKey || !dashboardData[sheetKey] || dashboardData[sheetKey].length === 0) return [];
    const firstRow = dashboardData[sheetKey][0];
    return Object.keys(firstRow).filter(k => k !== 'key');
  };

  const selectedSheet = Form.useWatch('sheetKey', form);
  const availableColumns = getAvailableColumns(selectedSheet);

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div className="section-title" style={{ margin: 0 }}>
          ZONE D: BIỂU ĐỒ TÙY CHỈNH<br/>
          <small style={{ fontWeight: 'normal', color: '#888', fontSize: 12 }}>CUSTOM CHARTS</small>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Tạo Biểu Đồ
        </Button>
      </div>

      {customCharts.length === 0 && (
        <Card bordered={false} style={{ textAlign: 'center', color: '#888', padding: '40px 0' }}>
          Chưa có biểu đồ tùy chỉnh nào. Bấm "Tạo Biểu Đồ" để bắt đầu.
        </Card>
      )}

      <Row gutter={[16, 16]}>
        {customCharts.map(chart => {
          const data = dashboardData[chart.sheetKey] || [];
          
          return (
            <Col xs={24} lg={12} xl={8} key={chart.id}>
              <Card 
                title={chart.title} 
                size="small" 
                bordered={false} 
                extra={<Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteChart(chart.id)} />}
                bodyStyle={{ padding: 12, height: 280 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  {chart.type === 'bar' ? (
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey={chart.xAxis} fontSize={11} />
                      <YAxis fontSize={11} />
                      <Tooltip cursor={{ fill: '#e6f7ff' }} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                      <Bar dataKey={chart.yAxis} fill="#1890ff" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : (
                    <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey={chart.xAxis} fontSize={11} />
                      <YAxis fontSize={11} />
                      <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                      <Line type="monotone" dataKey={chart.yAxis} stroke="#1890ff" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </Card>
            </Col>
          );
        })}
      </Row>

      <Modal
        title="Tạo Biểu Đồ Tùy Chỉnh (Custom Chart)"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveChart}>
          <Form.Item name="title" label="Tên biểu đồ (Chart Title)" rules={[{ required: true }]}>
            <Input placeholder="VD: Doanh thu theo ngày" />
          </Form.Item>
          <Form.Item name="sheetKey" label="Nguồn dữ liệu (Data Source)" rules={[{ required: true }]}>
            <Select placeholder="Chọn Sheet" onChange={() => form.resetFields(['xAxis', 'yAxis'])}>
              {TAB_MAP.map(tab => (
                <Select.Option key={tab.key} value={tab.key}>{tab.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="type" label="Loại biểu đồ (Chart Type)" rules={[{ required: true }]} initialValue="bar">
            <Select>
              <Select.Option value="bar">Biểu đồ Cột (Bar Chart)</Select.Option>
              <Select.Option value="line">Biểu đồ Đường (Line Chart)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="xAxis" label="Trục X (X-Axis)" rules={[{ required: true }]}>
            <Select placeholder="Chọn Cột" disabled={!selectedSheet}>
              {availableColumns.map(col => (
                <Select.Option key={col} value={col}>{col}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="yAxis" label="Trục Y (Y-Axis)" rules={[{ required: true }]}>
            <Select placeholder="Chọn Cột" disabled={!selectedSheet}>
              {availableColumns.map(col => (
                <Select.Option key={col} value={col}>{col}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
            <Button onClick={() => setIsModalOpen(false)} style={{ marginRight: 8 }}>Hủy</Button>
            <Button type="primary" htmlType="submit">Lưu Biểu Đồ</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomCharts;
