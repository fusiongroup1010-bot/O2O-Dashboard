import React, { useState, useEffect } from 'react';
import { Card, Typography, message, Table, Tabs, Input, InputNumber, Button, Space, Popconfirm, DatePicker } from 'antd';
import { SaveOutlined, ExportOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useDashboard } from '../context/DataContext';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const ExcelEditor = () => {
  const { dashboardData, updateAllData, allData, selectedDate } = useDashboard();
  const [localData, setLocalData] = useState(null);
  const [activeTab, setActiveTab] = useState('1');

  useEffect(() => {
    setLocalData(JSON.parse(JSON.stringify(dashboardData)));
  }, [dashboardData, selectedDate]);

  if (!localData) return null;

  // --- Handlers ---
  const handleConfigChange = (field, value) => {
    setLocalData(prev => ({ ...prev, cauHinh: { ...prev.cauHinh, [field]: value } }));
  };

  const handleArrayChange = (arrayField, index, objField, value) => {
    setLocalData(prev => {
      const newArray = [...(prev[arrayField] || [])];
      if (newArray[index]) {
        newArray[index] = { ...newArray[index], [objField]: value };
      }
      return { ...prev, [arrayField]: newArray };
    });
  };

  const addRow = (arrayField, defaultRow) => {
    setLocalData(prev => ({ ...prev, [arrayField]: [...(prev[arrayField] || []), defaultRow] }));
  };

  const deleteRow = (arrayField, index) => {
    setLocalData(prev => {
      const newArray = [...(prev[arrayField] || [])];
      newArray.splice(index, 1);
      return { ...prev, [arrayField]: newArray };
    });
  };

  const handleSave = () => {
    const newDataByDate = { ...allData, [selectedDate]: localData };
    updateAllData(newDataByDate);
    message.success('Đã lưu dữ liệu thành công! / Data saved successfully!');
  };

  const handleAddCustomColumn = () => {
    const tabMap = {
      '1': 'cauHinh', '2': 'onlineGmv', '3': 'onlineRoas', '4': 'adsConversion',
      '5': 'inventorySku', '6': 'stockSafety', '7': 'orderStatus', '8': 'offlineTraffic',
      '9': 'offlineSales', '10': 'skuSampling', '11': 'csResponse', '12': 'alertsLog'
    };
    const sheetKey = tabMap[activeTab];
    if (sheetKey === 'cauHinh') {
      message.warning('Không hỗ trợ thêm cột cho tab Cấu Hình');
      return;
    }
    const colName = prompt("Nhập tên cột mới / Enter new column name:");
    if (colName) {
      setLocalData(prev => {
        const existing = prev.customColumns?.[sheetKey] || [];
        return {
          ...prev,
          customColumns: {
            ...prev.customColumns,
            [sheetKey]: [...existing, colName]
          }
        };
      });
    }
  };

  const renderCustomColumns = (sheetKey) => {
    return localData.customColumns?.[sheetKey]?.map(colName => (
      <Table.Column 
        title={getColTitle(colName, 'Custom')} 
        key={colName}
        render={(_, r, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={r[colName] || ''} onChange={e => handleArrayChange(sheetKey, i, colName, e.target.value)} />} 
      />
    ));
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    
    Object.keys(localData).forEach(key => {
      if (key === 'cauHinh') {
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([localData[key]]), '02_Cau_Hinh');
      } else {
        const sheetName = key === 'onlineGmv' ? '03_Online_GMV' :
                          key === 'onlineRoas' ? '04_Online_ROAS' :
                          key === 'adsConversion' ? '05_Ads_Conversion' :
                          key === 'inventorySku' ? '06_Inventory_SKU' :
                          key === 'stockSafety' ? '07_Stock_Safety' :
                          key === 'orderStatus' ? '08_Order_Status' :
                          key === 'offlineTraffic' ? '09_Offline_Traffic' :
                          key === 'qrFunnel' ? '10_QR_Funnel' :
                          key === 'gmvChannel' ? '11_GMV_Channel' :
                          key === 'alertsLog' ? '13_Alerts_Log' : key;
        const data = localData[key] && localData[key].length > 0 ? localData[key] : [{}];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), sheetName);
      }
    });

    XLSX.writeFile(wb, `O2O_Data_${selectedDate}.xlsx`);
  };

  const getColTitle = (vi, en) => (
    <div style={{ lineHeight: '1.2' }}>
      <div>{vi}</div>
      <div style={{ fontSize: 10, color: '#888', fontWeight: 'normal' }}>{en}</div>
    </div>
  );

  const actionColumn = (arrayField) => ({
    title: getColTitle('Xoá', 'Delete'),
    key: 'action',
    width: 60,
    render: (_, __, index) => (
      <Popconfirm title="Xoá? / Delete?" onConfirm={() => deleteRow(arrayField, index)}>
        <Button danger type="text" icon={<DeleteOutlined />} size="small" />
      </Popconfirm>
    )
  });

  return (
    <div style={{ padding: '20px' }}>
      <Card 
        bordered={false} 
        title={<Title level={3} style={{ color: '#1890ff', margin: 0, lineHeight: 1.2 }}>Data Manager - Cập nhật dữ liệu<br/><span style={{fontSize: 14, color: '#888', fontWeight: 'normal'}}>Data Manager - Data Update</span></Title>}
        extra={
          <Space>
            <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddCustomColumn}>Thêm Cột (Add Column)</Button>
            <Button icon={<ExportOutlined />} onClick={exportToExcel}>Export Excel</Button>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>Lưu / Save</Button>
          </Space>
        }
      >
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          Ngày / <span style={{fontSize: 12}}>Date</span>: <b>{selectedDate}</b>. Nhập liệu trực tiếp vào các ô dưới đây / <span style={{fontSize: 12}}>Input data directly into the cells below</span>.
        </Text>

        <Tabs tabPosition="left" defaultActiveKey="1" activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
          {/* 02_Cau_Hinh */}
          <Tabs.TabPane tab="02_Cau_Hinh" key="1">
            <Title level={5} style={{lineHeight: 1.2}}>Cấu hình mục tiêu & Ngưỡng cảnh báo<br/><span style={{fontSize: 12, color: '#888', fontWeight: 'normal'}}>Target Configuration & Alert Thresholds</span></Title>
            <Text style={{ color: '#888', fontStyle: 'italic', marginBottom: 16, display: 'block' }}>Cập nhật khi có thay đổi chiến lược | Áp dụng cho toàn bộ dashboard<br/>Update on strategy change | Applies to entire dashboard</Text>
            <Table 
              dataSource={[
                { stt: 1, kpi: 'GMV mục tiêu / ngày\nDaily Target GMV', unit: 'VNĐ (triệu)', keyName: 'gmvTarget', rule: 'Tổng GMV mục tiêu Shopee + TikTok' },
                { stt: 2, kpi: 'ROAS tối thiểu\nMin ROAS', unit: 'lần', keyName: 'roasMin', rule: 'ROAS < ngưỡng -> cảnh báo CRITICAL' },
                { stt: 3, kpi: 'Thời gian phản hồi CS tối đa\nMax CS Response Time', unit: 'phút', keyName: 'csResponseMax', rule: 'CS > ngưỡng -> cảnh báo WARNING' },
                { stt: 4, kpi: 'Số ngày tồn kho an toàn\nSafety Stock Days', unit: 'ngày', keyName: 'safetyStockDays', rule: 'Stock < ngưỡng -> cảnh báo CRITICAL' },
                { stt: 5, kpi: 'Tỷ lệ huỷ đơn tối đa\nMax Cancel Rate', unit: '%', keyName: 'cancelMax', rule: 'Cancel rate > ngưỡng -> WARNING' },
                { stt: 6, kpi: 'QR Conversion tối thiểu\nMin QR Conv.', unit: '%', keyName: 'qrConvMin', rule: 'Conversion < ngưỡng -> WARNING' },
                { stt: 7, kpi: 'Ads Spend trần / ngày\nMax Daily Ads Spend', unit: 'VNĐ (triệu)', keyName: 'adsMax', rule: 'Ads vượt trần -> WARNING' },
                { stt: 8, kpi: 'Tồn kho an toàn\nSafety Stock (units)', unit: 'đơn vị', keyName: 'safetyStockVal', rule: 'Mốc tham chiếu cho Bar Chart Zone B-2' },
                { stt: 9, kpi: 'Rating CS tối thiểu\nMin CS Rating', unit: '/5', keyName: 'csRatingMin', rule: 'Trung bình rating dưới ngưỡng -> WARNING' },
                { stt: 10, kpi: 'Số đơn hoàn tối đa / ngày\nMax Daily Returns', unit: 'đơn', keyName: 'returnMax', rule: 'Trigger điều tra chất lượng' }
              ]} 
              pagination={false} size="small" bordered scroll={{ x: 'max-content' }}
            >
              <Table.Column title="STT" dataIndex="stt" width={50} align="center" />
              <Table.Column title={getColTitle('Chỉ tiêu (KPI)', 'Indicator')} dataIndex="kpi" render={(v) => <div style={{whiteSpace: 'pre-line'}}>{v}</div>} />
              <Table.Column title={getColTitle('Đơn vị', 'Unit')} dataIndex="unit" width={100} />
              <Table.Column title={getColTitle('Giá trị mục tiêu', 'Target Value')} render={(_, r) => (
                <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} 
                  value={localData.cauHinh?.[r.keyName]} 
                  onChange={e => handleConfigChange(r.keyName, isNaN(e.target.value) ? 0 : Number(e.target.value))} 
                  style={{ width: '100%', color: '#1890ff', fontWeight: 'bold' }} 
                />
              )} width={150} />
              <Table.Column title={getColTitle('Diễn giải / Quy tắc', 'Explanation / Rule')} dataIndex="rule" />
            </Table>
          </Tabs.TabPane>

          {/* 03_Online_GMV */}
          <Tabs.TabPane tab="03_Online_GMV" key="2">
            <Title level={5} style={{lineHeight: 1.2}}>GMV Thực tế vs Mục tiêu<br/><span style={{fontSize: 12, color: '#888', fontWeight: 'normal'}}>Actual vs Target GMV</span></Title>
            <Table dataSource={localData.onlineGmv?.map((r, i) => ({ ...r, key: i })) || []} pagination={false} size="small" bordered scroll={{ x: 'max-content' }}
              footer={() => <Button type="dashed" onClick={() => addRow('onlineGmv', { date: selectedDate, channel: 'Mới', target: 0, actual: 0, note: '' })} block icon={<PlusOutlined />}>Thêm Kênh / Add Channel</Button>}>
              <Table.Column 
                title={getColTitle('Ngày', 'Date')} 
                dataIndex="date" 
                width={140} 
                render={(v, _, i) => (
                  <DatePicker 
                    value={v ? dayjs(v, 'YYYY-MM-DD') : dayjs(selectedDate, 'YYYY-MM-DD')} 
                    format="YYYY-MM-DD" 
                    onChange={(date, dateStr) => handleArrayChange('onlineGmv', i, 'date', dateStr || selectedDate)} 
                    style={{width: '100%'}} 
                  />
                )} 
              />
              <Table.Column title={getColTitle('Kênh', 'Channel')} dataIndex="channel" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('onlineGmv', i, 'channel', e.target.value)} />} />
              <Table.Column title={getColTitle('Mục tiêu', 'Target')} dataIndex="target" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('onlineGmv', i, 'target', isNaN(e.target.value) ? 0 : Number(e.target.value))} />} />
              <Table.Column title={getColTitle('GMV thực tế', 'Actual GMV')} dataIndex="actual" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('onlineGmv', i, 'actual', isNaN(e.target.value) ? 0 : Number(e.target.value))} />} />
              <Table.Column title={getColTitle('% Đạt', '% Achieved')} render={(_, r, i) => {
                const pct = ((r.actual || 0) / (r.target || 1)) * 100;
                const displayVal = r.override_pct !== undefined ? r.override_pct : pct.toFixed(1);
                return <Input value={displayVal} onChange={e => handleArrayChange('onlineGmv', i, 'override_pct', e.target.value)} addonAfter="%" style={{ width: 100 }} />;
              }} />
              <Table.Column title={getColTitle('Chênh lệch', 'Variance')} render={(_, r, i) => {
                const variance = ((r.actual || 0) - (r.target || 0));
                const displayVal = r.override_variance !== undefined ? r.override_variance : variance.toLocaleString();
                return <Input value={displayVal} onChange={e => handleArrayChange('onlineGmv', i, 'override_variance', e.target.value)} style={{ width: 120 }} />;
              }} />
              <Table.Column title={getColTitle('Ghi chú', 'Note')} dataIndex="note" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('onlineGmv', i, 'note', e.target.value)} />} />
              {renderCustomColumns('onlineGmv')}
              <Table.Column {...actionColumn('onlineGmv')} />
            </Table>
          </Tabs.TabPane>

          {/* 04_Online_ROAS */}
          <Tabs.TabPane tab="04_Online_ROAS" key="3">
            <Table dataSource={localData.onlineRoas?.map((r, i) => ({ ...r, key: i })) || []} pagination={false} size="small" bordered scroll={{ x: 'max-content' }}
              footer={() => <Button type="dashed" onClick={() => addRow('onlineRoas', { date: selectedDate, time: '00:00', channel: 'Shopee', rev: 0, spend: 0 })} block icon={<PlusOutlined />}>Thêm Giờ / Add Time</Button>}>
              <Table.Column 
                title={getColTitle('Ngày', 'Date')} 
                dataIndex="date" 
                width={140} 
                render={(v, _, i) => (
                  <DatePicker 
                    value={v ? dayjs(v, 'YYYY-MM-DD') : dayjs(selectedDate, 'YYYY-MM-DD')} 
                    format="YYYY-MM-DD" 
                    onChange={(date, dateStr) => handleArrayChange('onlineRoas', i, 'date', dateStr || selectedDate)} 
                    style={{width: '100%'}} 
                  />
                )} 
              />
              <Table.Column title={getColTitle('Giờ', 'Time')} dataIndex="time" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('onlineRoas', i, 'time', e.target.value)} />} />
              <Table.Column title={getColTitle('Kênh', 'Channel')} dataIndex="channel" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('onlineRoas', i, 'channel', e.target.value)} />} />
              <Table.Column title={getColTitle('Doanh thu Ads', 'Ads Revenue')} dataIndex="rev" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('onlineRoas', i, 'rev', isNaN(e.target.value) ? 0 : Number(e.target.value))} />} />
              <Table.Column title={getColTitle('Chi phí Ads', 'Ads Spend')} dataIndex="spend" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('onlineRoas', i, 'spend', isNaN(e.target.value) ? 0 : Number(e.target.value))} />} />
              <Table.Column title="ROAS" render={(_, r, i) => {
                const roas = (r.spend || 0) > 0 ? ((r.rev || 0) / r.spend) : 0;
                const displayVal = r.override_roas !== undefined ? r.override_roas : roas.toFixed(2);
                return <Input value={displayVal} onChange={e => handleArrayChange('onlineRoas', i, 'override_roas', e.target.value)} style={{ width: 80, fontWeight: 'bold' }} />;
              }} />
              <Table.Column title={getColTitle('Trạng thái', 'Status')} render={(_, r) => {
                const roas = (r.spend || 0) > 0 ? ((r.rev || 0) / r.spend) : 0;
                const targetRoas = localData.cauHinh?.roasMin || 5.5;
                const isCritical = roas < targetRoas;
                return <span style={{ padding: '2px 8px', borderRadius: 4, background: isCritical ? '#f5222d' : '#52c41a', color: 'white', fontWeight: 'bold' }}>
                  {isCritical ? 'CRITICAL' : 'NORMAL'}
                </span>;
              }} />
              {renderCustomColumns('onlineRoas')}
              <Table.Column {...actionColumn('onlineRoas')} />
            </Table>
          </Tabs.TabPane>

          {/* 05_Ads_Conversion */}
          <Tabs.TabPane tab="05_Ads_Conversion" key="4">
            <Table dataSource={localData.adsConversion?.map((r, i) => ({ ...r, key: i })) || []} pagination={false} size="small" bordered scroll={{ x: 'max-content' }}
              footer={() => <Button type="dashed" onClick={() => addRow('adsConversion', { date: selectedDate, time: '00:00', clicks: 0, orders: 0 })} block icon={<PlusOutlined />}>Thêm Giờ / Add Time</Button>}>
              <Table.Column 
                title={getColTitle('Ngày', 'Date')} 
                dataIndex="date" 
                width={140} 
                render={(v, _, i) => (
                  <DatePicker 
                    value={v ? dayjs(v, 'YYYY-MM-DD') : dayjs(selectedDate, 'YYYY-MM-DD')} 
                    format="YYYY-MM-DD" 
                    onChange={(date, dateStr) => handleArrayChange('adsConversion', i, 'date', dateStr || selectedDate)} 
                    style={{width: '100%'}} 
                  />
                )} 
              />
              <Table.Column title={getColTitle('Giờ', 'Time')} dataIndex="time" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('adsConversion', i, 'time', e.target.value)} />} />

              <Table.Column title={getColTitle('Lượt click', 'Clicks')} dataIndex="clicks" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('adsConversion', i, 'clicks', isNaN(e.target.value) ? 0 : Number(e.target.value))} />} />
              <Table.Column title={getColTitle('Đơn hàng', 'Orders')} dataIndex="orders" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('adsConversion', i, 'orders', isNaN(e.target.value) ? 0 : Number(e.target.value))} />} />
              <Table.Column title={getColTitle('Conv. (%)', 'Conv. (%)')} render={(_, r, i) => {
                const conv = (r.clicks || 0) > 0 ? ((r.orders || 0) / r.clicks) * 100 : 0;
                const displayVal = r.override_conv !== undefined ? r.override_conv : conv.toFixed(2);
                return <Input value={displayVal} onChange={e => handleArrayChange('adsConversion', i, 'override_conv', e.target.value)} addonAfter="%" style={{ width: 100, fontWeight: 'bold' }} />;
              }} />
              {renderCustomColumns('adsConversion')}
              <Table.Column {...actionColumn('adsConversion')} />
            </Table>
          </Tabs.TabPane>

          {/* 06_Inventory_SKU */}
          <Tabs.TabPane tab="06_Inventory_SKU" key="5">
            <Table dataSource={localData.inventorySku?.map((r, i) => ({ ...r, key: i })) || []} pagination={false} size="small" bordered scroll={{ x: 'max-content' }}
              footer={() => <Button type="dashed" onClick={() => addRow('inventorySku', { date: selectedDate, sku: 'Mới', name: '', inventory: 0, salesPerDay: 1 })} block icon={<PlusOutlined />}>Thêm SKU / Add SKU</Button>}>
              <Table.Column 
                title={getColTitle('Ngày', 'Date')} 
                dataIndex="date" 
                width={140} 
                render={(v, _, i) => (
                  <DatePicker 
                    value={v ? dayjs(v, 'YYYY-MM-DD') : dayjs(selectedDate, 'YYYY-MM-DD')} 
                    format="YYYY-MM-DD" 
                    onChange={(date, dateStr) => handleArrayChange('inventorySku', i, 'date', dateStr || selectedDate)} 
                    style={{width: '100%'}} 
                  />
                )} 
              />
              <Table.Column title={getColTitle('Mã SKU', 'SKU Code')} dataIndex="sku" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('inventorySku', i, 'sku', e.target.value)} />} />
              <Table.Column title={getColTitle('Tên sản phẩm', 'Product Name')} dataIndex="name" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('inventorySku', i, 'name', e.target.value)} />} />
              <Table.Column title={getColTitle('Tồn kho', 'Inventory')} dataIndex="inventory" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('inventorySku', i, 'inventory', isNaN(e.target.value) ? 0 : Number(e.target.value))} />} />
              <Table.Column title={getColTitle('Bán/ngày TB', 'Avg Daily Sales')} dataIndex="salesPerDay" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('inventorySku', i, 'salesPerDay', isNaN(e.target.value) ? 0 : Number(e.target.value))} />} />
              <Table.Column title={getColTitle('Số ngày tồn còn lại', 'Remaining Days')} render={(_, r, i) => {
                const days = (r.salesPerDay || 0) > 0 ? ((r.inventory || 0) / r.salesPerDay) : 0;
                const displayVal = r.override_days !== undefined ? r.override_days : days.toFixed(1);
                return <Input value={displayVal} onChange={e => handleArrayChange('inventorySku', i, 'override_days', e.target.value)} style={{ width: 80, fontWeight: 'bold' }} />;
              }} />
              <Table.Column title={getColTitle('Cảnh báo', 'Alert')} render={(_, r) => {
                const days = (r.salesPerDay || 0) > 0 ? ((r.inventory || 0) / r.salesPerDay) : 0;
                const targetDays = localData.cauHinh?.safetyStockDays || 3;
                const isCritical = days < targetDays;
                return <span style={{ padding: '2px 8px', borderRadius: 4, background: isCritical ? '#f5222d' : '#52c41a', color: 'white', fontWeight: 'bold' }}>
                  {isCritical ? 'CRITICAL' : 'NORMAL'}
                </span>;
              }} />
              {renderCustomColumns('inventorySku')}
              <Table.Column {...actionColumn('inventorySku')} />
            </Table>
          </Tabs.TabPane>

          {/* 07_Stock_Safety */}
          <Tabs.TabPane tab="07_Stock_Safety" key="6">
            <Table dataSource={localData.stockSafety?.map((r, i) => ({ ...r, key: i })) || []} pagination={false} size="small" bordered scroll={{ x: 'max-content' }}
              footer={() => <Button type="dashed" onClick={() => addRow('stockSafety', { date: selectedDate, current: 0, safety: 0, note: '' })} block icon={<PlusOutlined />}>Thêm dòng / Add Row</Button>}>
              <Table.Column 
                title={getColTitle('Ngày', 'Date')} 
                dataIndex="date" 
                width={140} 
                render={(v, _, i) => (
                  <DatePicker 
                    value={v ? dayjs(v, 'YYYY-MM-DD') : dayjs(selectedDate, 'YYYY-MM-DD')} 
                    format="YYYY-MM-DD" 
                    onChange={(date, dateStr) => handleArrayChange('stockSafety', i, 'date', dateStr || selectedDate)} 
                    style={{width: '100%'}} 
                  />
                )} 
              />
              <Table.Column title={getColTitle('Tồn kho tổng', 'Total Stock')} dataIndex="current" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('stockSafety', i, 'current', isNaN(e.target.value) ? 0 : Number(e.target.value))} />} />
              <Table.Column title={getColTitle('Safety Stock (ref)', 'Safety Stock')} dataIndex="safety" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('stockSafety', i, 'safety', isNaN(e.target.value) ? 0 : Number(e.target.value))} />} />
              <Table.Column title={getColTitle('Chênh lệch', 'Variance')} render={(_, r, i) => {
                const variance = ((r.current || 0) - (r.safety || 0));
                const displayVal = r.override_variance !== undefined ? r.override_variance : variance.toLocaleString();
                return <Input value={displayVal} onChange={e => handleArrayChange('stockSafety', i, 'override_variance', e.target.value)} style={{ width: 120 }} />;
              }} />
              <Table.Column title={getColTitle('Trạng thái', 'Status')} render={(_, r) => {
                const diff = (r.current || 0) - (r.safety || 0);
                const isNormal = diff >= 0;
                return <span style={{ padding: '2px 8px', borderRadius: 4, background: isNormal ? '#52c41a' : '#f5222d', color: 'white', fontWeight: 'bold' }}>
                  {isNormal ? 'NORMAL' : 'CRITICAL'}
                </span>;
              }} />
              <Table.Column title={getColTitle('Ghi chú', 'Note')} dataIndex="note" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('stockSafety', i, 'note', e.target.value)} />} />
              {renderCustomColumns('stockSafety')}
              <Table.Column {...actionColumn('stockSafety')} />
            </Table>
          </Tabs.TabPane>

          {/* 08_Order_Status */}
          <Tabs.TabPane tab="08_Order_Status" key="7">
            <Table dataSource={localData.orderStatus?.map((r, i) => ({ ...r, key: i })) || []} pagination={false} size="small" bordered scroll={{ x: 'max-content' }}
              footer={() => <Button type="dashed" onClick={() => addRow('orderStatus', { date: selectedDate, total: 0, success: 0, cancelled: 0, returned: 0, note: '' })} block icon={<PlusOutlined />}>Thêm dòng / Add Row</Button>}>
              <Table.Column 
                title={getColTitle('Ngày', 'Date')} 
                dataIndex="date" 
                width={140} 
                render={(v, _, i) => (
                  <DatePicker 
                    value={v ? dayjs(v, 'YYYY-MM-DD') : dayjs(selectedDate, 'YYYY-MM-DD')} 
                    format="YYYY-MM-DD" 
                    onChange={(date, dateStr) => handleArrayChange('orderStatus', i, 'date', dateStr || selectedDate)} 
                    style={{width: '100%'}} 
                  />
                )} 
              />
              <Table.Column title={getColTitle('Tổng đơn', 'Total Orders')} dataIndex="total" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('orderStatus', i, 'total', isNaN(e.target.value) ? 0 : Number(e.target.value))} />} />
              <Table.Column title={getColTitle('Đơn thành công', 'Successful')} dataIndex="success" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('orderStatus', i, 'success', isNaN(e.target.value) ? 0 : Number(e.target.value))} />} />
              <Table.Column title={getColTitle('Đơn huỷ', 'Cancelled')} dataIndex="cancelled" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('orderStatus', i, 'cancelled', isNaN(e.target.value) ? 0 : Number(e.target.value))} />} />
              <Table.Column title={getColTitle('Đơn hoàn', 'Returned')} dataIndex="returned" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('orderStatus', i, 'returned', isNaN(e.target.value) ? 0 : Number(e.target.value))} />} />
              <Table.Column title={getColTitle('% Huỷ+Hoàn', '% Bad Orders')} render={(_, r, i) => {
                const total = r.total || 1;
                const bad = (r.cancelled || 0) + (r.returned || 0);
                const pct = ((bad / total) * 100);
                const displayVal = r.override_bad_pct !== undefined ? r.override_bad_pct : pct.toFixed(1);
                return <Input value={displayVal} onChange={e => handleArrayChange('orderStatus', i, 'override_bad_pct', e.target.value)} addonAfter="%" style={{ width: 100, fontWeight: 'bold' }} />;
              }} />
              <Table.Column title={getColTitle('Ghi chú', 'Note')} dataIndex="note" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('orderStatus', i, 'note', e.target.value)} />} />
              {renderCustomColumns('orderStatus')}
              <Table.Column {...actionColumn('orderStatus')} />
            </Table>
          </Tabs.TabPane>

          {/* 09_Offline_Traffic */}
          <Tabs.TabPane tab="09_Offline_Traffic" key="8">
             <Table dataSource={localData.offlineTraffic?.map((r, i) => ({ ...r, key: i })) || []} pagination={false} size="small" bordered scroll={{ x: 'max-content' }}
              footer={() => <Button type="dashed" onClick={() => addRow('offlineTraffic', { date: selectedDate, region: 'Miền Nam', store: 'Cửa hàng', shopsCheckedIn: 0, note: '' })} block icon={<PlusOutlined />}>Thêm dòng / Add Row</Button>}>
              <Table.Column 
                title={getColTitle('Ngày', 'Date')} 
                dataIndex="date" 
                width={140} 
                render={(v, _, i) => (
                  <DatePicker 
                    value={v ? dayjs(v, 'YYYY-MM-DD') : dayjs(selectedDate, 'YYYY-MM-DD')} 
                    format="YYYY-MM-DD" 
                    onChange={(date, dateStr) => handleArrayChange('offlineTraffic', i, 'date', dateStr || selectedDate)} 
                    style={{width: '100%'}} 
                  />
                )} 
              />
              <Table.Column title={getColTitle('Khu vực', 'Region')} dataIndex="region" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('offlineTraffic', i, 'region', e.target.value)} />} />
              <Table.Column title={getColTitle('Điểm bán', 'Store')} dataIndex="store" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('offlineTraffic', i, 'store', e.target.value)} />} />
              <Table.Column title={getColTitle('Số shop check in', 'Shops Checked-in')} dataIndex="shopsCheckedIn" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('offlineTraffic', i, 'shopsCheckedIn', isNaN(e.target.value) ? 0 : Number(e.target.value))} />} />
              <Table.Column title={getColTitle('Ghi chú', 'Note')} dataIndex="note" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('offlineTraffic', i, 'note', e.target.value)} />} />
              {renderCustomColumns('offlineTraffic')}
              <Table.Column {...actionColumn('offlineTraffic')} />
            </Table>
          </Tabs.TabPane>

          {/* 10_Offline_Sales */}
          <Tabs.TabPane tab="10_Offline_Sales" key="9">
             <Table dataSource={localData.offlineSales?.map((r, i) => ({ ...r, key: i })) || []} pagination={false} size="small" bordered scroll={{ x: 'max-content' }}
              footer={() => <Button type="dashed" onClick={() => addRow('offlineSales', { date: selectedDate, region: 'Miền Nam', store: 'Cửa hàng', qtySold: 0, note: '' })} block icon={<PlusOutlined />}>Thêm dòng / Add Row</Button>}>
              <Table.Column 
                title={getColTitle('Ngày', 'Date')} 
                dataIndex="date" 
                width={140} 
                render={(v, _, i) => (
                  <DatePicker 
                    value={v ? dayjs(v, 'YYYY-MM-DD') : dayjs(selectedDate, 'YYYY-MM-DD')} 
                    format="YYYY-MM-DD" 
                    onChange={(date, dateStr) => handleArrayChange('offlineSales', i, 'date', dateStr || selectedDate)} 
                    style={{width: '100%'}} 
                  />
                )} 
              />
              <Table.Column title={getColTitle('Khu vực', 'Region')} dataIndex="region" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('offlineSales', i, 'region', e.target.value)} />} />
              <Table.Column title={getColTitle('Điểm bán', 'Store')} dataIndex="store" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('offlineSales', i, 'store', e.target.value)} />} />
              <Table.Column title={getColTitle('Lượng hàng bán được', 'Quantity Sold')} dataIndex="qtySold" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('offlineSales', i, 'qtySold', isNaN(e.target.value) ? 0 : Number(e.target.value))} />} />
              <Table.Column title={getColTitle('Ghi chú', 'Note')} dataIndex="note" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('offlineSales', i, 'note', e.target.value)} />} />
              {renderCustomColumns('offlineSales')}
              <Table.Column {...actionColumn('offlineSales')} />
            </Table>
          </Tabs.TabPane>

          {/* 11_SKU_Sampling */}
          <Tabs.TabPane tab="11_SKU_Sampling" key="10">
             <Table dataSource={localData.skuSampling?.map((r, i) => ({ ...r, key: i })) || []} pagination={false} size="small" bordered scroll={{ x: 'max-content' }}
              footer={() => <Button type="dashed" onClick={() => addRow('skuSampling', { date: selectedDate, sku: 'Mã SKU', qtySold: 0, samples: 0 })} block icon={<PlusOutlined />}>Thêm dòng / Add Row</Button>}>
              <Table.Column 
                title={getColTitle('Ngày', 'Date')} 
                dataIndex="date" 
                width={150} 
                render={(v, _, i) => (
                  <DatePicker 
                    value={v ? dayjs(v, 'YYYY-MM-DD') : dayjs(selectedDate, 'YYYY-MM-DD')} 
                    format="YYYY-MM-DD" 
                    onChange={(date, dateStr) => handleArrayChange('skuSampling', i, 'date', dateStr || selectedDate)} 
                    style={{width: '100%'}} 
                  />
                )} 
              />
              <Table.Column title={getColTitle('Mã SKU', 'SKU')} dataIndex="sku" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('skuSampling', i, 'sku', e.target.value)} />} />
              <Table.Column title={getColTitle('SL bán được', 'Qty Sold')} dataIndex="qtySold" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('skuSampling', i, 'qtySold', isNaN(e.target.value) ? 0 : Number(e.target.value))} />} />
              <Table.Column title={getColTitle('Sample phát đi', 'Samples Distributed')} dataIndex="samples" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('skuSampling', i, 'samples', isNaN(e.target.value) ? 0 : Number(e.target.value))} />} />
              <Table.Column title={getColTitle('Tổng cộng', 'Total')} render={(_, r, i) => {
                const total = (r.qtySold || 0) + (r.samples || 0);
                const displayVal = r.override_total !== undefined ? r.override_total : total;
                return <Input value={displayVal} onChange={e => handleArrayChange('skuSampling', i, 'override_total', e.target.value)} style={{ fontWeight: 'bold' }} />;
              }} />
              {renderCustomColumns('skuSampling')}
              <Table.Column {...actionColumn('skuSampling')} />
            </Table>
          </Tabs.TabPane>

          {/* 12_CS_Response */}
          <Tabs.TabPane tab="12_CS_Response" key="11">
            <Table dataSource={localData.csResponse?.map((r, i) => ({ ...r, key: i })) || []} pagination={false} size="small" bordered scroll={{ x: 'max-content' }}
              footer={() => <Button type="dashed" onClick={() => addRow('csResponse', { date: selectedDate, shift: 'Mới', tickets: 0, responseTime: 0, rating: 5, note: '' })} block icon={<PlusOutlined />}>Thêm Ca / Add Shift</Button>}>
              <Table.Column 
                title={getColTitle('Ngày', 'Date')} 
                dataIndex="date" 
                width={140} 
                render={(v, _, i) => (
                  <DatePicker 
                    value={v ? dayjs(v, 'YYYY-MM-DD') : dayjs(selectedDate, 'YYYY-MM-DD')} 
                    format="YYYY-MM-DD" 
                    onChange={(date, dateStr) => handleArrayChange('csResponse', i, 'date', dateStr || selectedDate)} 
                    style={{width: '100%'}} 
                  />
                )} 
              />
              <Table.Column title={getColTitle('Ca', 'Shift')} dataIndex="shift" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('csResponse', i, 'shift', e.target.value)} />} />
              <Table.Column title={getColTitle('Số ticket xử lý', 'Tickets Handled')} dataIndex="tickets" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('csResponse', i, 'tickets', isNaN(e.target.value) ? 0 : Number(e.target.value))} />} />
              <Table.Column title={getColTitle('TB phản hồi (phút)', 'Avg Response (min)')} dataIndex="responseTime" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('csResponse', i, 'responseTime', isNaN(e.target.value) ? 0 : Number(e.target.value))} />} />
              <Table.Column title={getColTitle('Rating TB (/5)', 'Avg Rating')} dataIndex="rating" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('csResponse', i, 'rating', isNaN(e.target.value) ? 0 : Number(e.target.value))} />} />
              <Table.Column title={getColTitle('Trạng thái', 'Status')} render={(_, r) => {
                const targetTime = localData.cauHinh?.csResponseMax || 5;
                const isWarning = (r.responseTime || 0) > targetTime;
                return <span style={{ padding: '2px 8px', borderRadius: 4, background: isWarning ? '#fa8c16' : '#52c41a', color: 'white', fontWeight: 'bold' }}>
                  {isWarning ? 'WARNING' : 'NORMAL'}
                </span>;
              }} />
              <Table.Column title={getColTitle('Ghi chú', 'Note')} dataIndex="note" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('csResponse', i, 'note', e.target.value)} />} />
              {renderCustomColumns('csResponse')}
              <Table.Column {...actionColumn('csResponse')} />
            </Table>
          </Tabs.TabPane>

          {/* 13_Alerts_Log */}
          <Tabs.TabPane tab="13_Alerts_Log" key="12">
             <Table dataSource={localData.alertsLog?.map((r, i) => ({ ...r, key: i })) || []} pagination={false} size="small" bordered scroll={{ x: 'max-content' }}
              footer={() => <Button type="dashed" onClick={() => addRow('alertsLog', { date: selectedDate, time: '00:00', type: 'CRITICAL', message: '', handler: '', action: '', status: 'Chưa xử lý' })} block icon={<PlusOutlined />}>Thêm Cảnh báo / Add Alert</Button>}>
              <Table.Column 
                title={getColTitle('Ngày', 'Date')} 
                dataIndex="date" 
                width={140} 
                render={(v, _, i) => (
                  <DatePicker 
                    value={v ? dayjs(v, 'YYYY-MM-DD') : dayjs(selectedDate, 'YYYY-MM-DD')} 
                    format="YYYY-MM-DD" 
                    onChange={(date, dateStr) => handleArrayChange('alertsLog', i, 'date', dateStr || selectedDate)} 
                    style={{width: '100%'}} 
                  />
                )} 
              />
              <Table.Column title={getColTitle('Giờ', 'Time')} dataIndex="time" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange('alertsLog', i, 'time', e.target.value)} />} />
              <Table.Column title={getColTitle('Mức độ', 'Severity')} dataIndex="type" render={(v, _, i) => {
                const isCritical = v?.toUpperCase() === 'CRITICAL';
                return <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} style={{ background: isCritical ? '#f5222d' : '#fa8c16', color: 'white', fontWeight: 'bold', border: 'none', textAlign: 'center', padding: '0 4px' }} onChange={e => handleArrayChange('alertsLog', i, 'type', e.target.value)} />
              }} />
              <Table.Column title={getColTitle('Nội dung cảnh báo', 'Alert Message')} dataIndex="message" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} style={{ color: '#1890ff' }} onChange={e => handleArrayChange('alertsLog', i, 'message', e.target.value)} />} />
              <Table.Column title={getColTitle('Người xử lý', 'Handler')} dataIndex="handler" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} style={{ color: '#1890ff' }} onChange={e => handleArrayChange('alertsLog', i, 'handler', e.target.value)} />} />
              <Table.Column title={getColTitle('Hành động', 'Action')} dataIndex="action" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} style={{ color: '#1890ff' }} onChange={e => handleArrayChange('alertsLog', i, 'action', e.target.value)} />} />
              <Table.Column title={getColTitle('Trạng thái', 'Status')} dataIndex="status" render={(v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} style={{ color: '#1890ff' }} onChange={e => handleArrayChange('alertsLog', i, 'status', e.target.value)} />} />
              {renderCustomColumns('alertsLog')}
              <Table.Column {...actionColumn('alertsLog')} />
            </Table>
          </Tabs.TabPane>

        </Tabs>
      </Card>
    </div>
  );
};

export default ExcelEditor;
