import React, { useEffect, useMemo } from 'react';
import { Modal, Form, Select, Input, Button } from 'antd';
import { useDashboard } from '../context/DataContext';
import { TAB_MAP, SHEET_COLUMNS } from '../config/dashboardConfig';

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

  const selectedSheet = Form.useWatch('sheetKey', form);
  const selectedType = Form.useWatch('type', form);
  
  // Use SHEET_COLUMNS config for the selected sheet, fallback to dynamic extraction if not found
  const availableColumns = useMemo(() => {
    if (!selectedSheet) return [];
    if (SHEET_COLUMNS[selectedSheet]) {
      return SHEET_COLUMNS[selectedSheet];
    }
    // Fallback for custom sheets if they exist
    if (!dashboardData[selectedSheet] || dashboardData[selectedSheet].length === 0) return [];
    const firstRow = dashboardData[selectedSheet][0];
    return Object.keys(firstRow)
      .filter(k => k !== 'key' && k !== 'action')
      .map(k => ({ key: k, label: k }));
  }, [selectedSheet, dashboardData]);

  const handleTypeChange = () => {
    // Reset X and Y axis when chart type changes to avoid type mismatches (string vs array)
    form.resetFields(['xAxis', 'yAxis']);
  };

  const isMultipleY = ['bar', 'stacked_bar', 'line'].includes(selectedType);
  const showXAxis = selectedType !== 'gauge';

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
          <Select onChange={handleTypeChange}>
            <Select.Option value="bar">Biểu đồ Cột (Bar Chart)</Select.Option>
            <Select.Option value="stacked_bar">Biểu đồ Cột Chồng (Stacked Bar)</Select.Option>
            <Select.Option value="line">Biểu đồ Đường (Line Chart)</Select.Option>
            <Select.Option value="pie">Biểu đồ Tròn (Pie Chart)</Select.Option>
            <Select.Option value="gauge">Biểu đồ Thước đo (Gauge Chart)</Select.Option>
            <Select.Option value="bubble">Biểu đồ Bong bóng (Bubble Chart)</Select.Option>
          </Select>
        </Form.Item>
        
        {showXAxis && (
          <Form.Item name="xAxis" label="Trục X (X-Axis)" rules={[{ required: true }]}>
            <Select placeholder="Chọn Cột" disabled={!selectedSheet}>
              {availableColumns.map(col => (
                <Select.Option key={col.key} value={col.key}>{col.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        
        <Form.Item name="yAxis" label="Trục Y (Y-Axis)" rules={[{ required: true }]}>
          <Select placeholder="Chọn Cột" disabled={!selectedSheet} mode={isMultipleY ? 'multiple' : undefined}>
            {availableColumns.map(col => (
              <Select.Option key={col.key} value={col.key}>{col.label}</Select.Option>
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
