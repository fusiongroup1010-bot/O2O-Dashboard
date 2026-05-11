import React, { useEffect } from 'react';
import { Modal, Form, Select, Input, Button } from 'antd';
import { useDashboard } from '../context/DataContext';

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

const CustomChartModal = ({ open, onCancel, targetZone }) => {
  const { dashboardData, updateAllData, allData, selectedDate } = useDashboard();
  const [form] = Form.useForm();
  
  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({ zone: targetZone });
    }
  }, [open, targetZone, form]);

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
    onCancel();
  };

  const getAvailableColumns = (sheetKey) => {
    if (!sheetKey || !dashboardData[sheetKey] || dashboardData[sheetKey].length === 0) return [];
    const firstRow = dashboardData[sheetKey][0];
    return Object.keys(firstRow).filter(k => k !== 'key' && k !== 'action');
  };

  const selectedSheet = Form.useWatch('sheetKey', form);
  const availableColumns = getAvailableColumns(selectedSheet);

  return (
    <Modal
      title={`Tạo Biểu Đồ Tùy Chỉnh - Zone ${targetZone}`}
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSaveChart}>
        <Form.Item name="zone" hidden>
          <Input />
        </Form.Item>
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
          <Button onClick={onCancel} style={{ marginRight: 8 }}>Hủy</Button>
          <Button type="primary" htmlType="submit">Lưu Biểu Đồ</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CustomChartModal;
