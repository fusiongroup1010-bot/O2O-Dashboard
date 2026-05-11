import React, { useState, useEffect } from 'react';
import { Card, Typography, message, Table, Tabs, Input, Button, Space, Popconfirm, DatePicker, Dropdown } from 'antd';
import { SaveOutlined, ExportOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useDashboard } from '../context/DataContext';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const ExcelEditor = () => {
  const { dashboardData, updateAllData, allData, selectedDate } = useDashboard();
  const [localData, setLocalData] = useState(null);
  const [activeTab, setActiveTab] = useState('1');
  const [isColModalOpen, setIsColModalOpen] = useState(false);
  const [colModalData, setColModalData] = useState({ sheetKey: '', refKey: '', direction: '' });
  const [newColName, setNewColName] = useState('');


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
                          key === 'offlineSales' ? '10_Offline_Sales' :
                          key === 'skuSampling' ? '11_SKU_Sampling' :
                          key === 'csResponse' ? '12_CS_Response' :
                          key === 'alertsLog' ? '13_Alerts_Log' : key;
        const data = localData[key] && localData[key].length > 0 ? localData[key] : [{}];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), sheetName);
      }
    });
    XLSX.writeFile(wb, `O2O_Data_${selectedDate}.xlsx`);
  };

  // --- Dynamic Columns & Context Menu ---
  const openInsertModal = (sheetKey, refKey, direction) => {
    setColModalData({ sheetKey, refKey, direction });
    setNewColName('');
    setIsColModalOpen(true);
  };

  const handleConfirmInsert = () => {
    if (!newColName) {
      message.warning('Vui lòng nhập tên cột! / Please enter column name!');
      return;
    }
    const { sheetKey, refKey, direction } = colModalData;
    const colId = 'custom_' + Date.now();
    const afterCol = direction === 'right' ? refKey : refKey; 
    
    setLocalData(prev => {
      const existing = prev.customColumns?.[sheetKey] || [];
      return {
        ...prev,
        customColumns: {
          ...prev.customColumns,
          [sheetKey]: [...existing, { id: colId, name: newColName, after: afterCol }]
        }
      };
    });
    setIsColModalOpen(false);
    message.success('Đã thêm cột! Nhấn Lưu để hoàn tất. / Column added! Click Save to finish.');
  };

  const handleDeleteColumn = (sheetKey, colId) => {
    setLocalData(prev => {
      const existing = prev.customColumns?.[sheetKey] || [];
      return {
        ...prev,
        customColumns: {
          ...prev.customColumns,
          [sheetKey]: existing.filter(c => c.id !== colId)
        }
      };
    });
  };

  const getMenu = (sheetKey, colKey, prevColKey, isCustom) => ({
    items: [
      { key: 'insert_left', label: 'Chèn cột bên trái / Insert Left' },
      { key: 'insert_right', label: 'Chèn cột bên phải / Insert Right' },
      ...(isCustom ? [{ type: 'divider' }, { key: 'delete', label: 'Xóa cột này / Delete Column', danger: true }] : [])
    ],
    onClick: (e) => {
      if (e.key === 'insert_left') openInsertModal(sheetKey, prevColKey, 'right');
      else if (e.key === 'insert_right') openInsertModal(sheetKey, colKey, 'right');
      else if (e.key === 'delete') handleDeleteColumn(sheetKey, colKey);
    }
  });

  const getHeaderWrapper = (sheetKey, colKey, prevColKey, isCustom, vi, en) => (
    <Dropdown menu={getMenu(sheetKey, colKey, prevColKey, isCustom)} trigger={['contextMenu']}>
      <div style={{ lineHeight: '1.2', cursor: 'context-menu', userSelect: 'none' }}>
        <div>{vi}</div>
        <div style={{ fontSize: 10, color: '#888', fontWeight: 'normal' }}>{en}</div>
      </div>
    </Dropdown>
  );

  const buildColumns = (sheetKey, staticCols) => {
    let rawCustomCols = localData.customColumns?.[sheetKey] || [];
    // Sanitize: filter out any old string values from previous data format
    const customCols = rawCustomCols.filter(c => typeof c === 'object' && c !== null && c.id);
    
    let result = [];
    
    const addCustomsAfter = (key) => {
      const toAdd = customCols.filter(c => c.after === key);
      toAdd.forEach(c => {
        result.push({
          key: c.id, dataIndex: c.id, isCustom: true, titleVi: c.name, titleEn: 'Custom',
          render: (_, r, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={r[c.id] || ''} onChange={e => handleArrayChange(sheetKey, i, c.id, e.target.value)} />
        });
        addCustomsAfter(c.id);
      });
    };

    addCustomsAfter('START');

    staticCols.forEach(col => {
      result.push({ ...col, isCustom: false });
      addCustomsAfter(col.key);
    });

    const actionCol = {
      key: 'action', width: 60, titleVi: 'Xoá', titleEn: 'Delete', isAction: true,
      render: (_, __, index) => (
        <Popconfirm title="Xoá? / Delete?" onConfirm={() => deleteRow(sheetKey, index)}>
          <Button danger type="text" icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      )
    };
    result.push(actionCol);
    
    return result.map((col, idx) => {
      const prevColKey = idx === 0 ? 'START' : result[idx - 1].key;
      return {
        ...col,
        title: col.isAction ? (
          <div style={{ lineHeight: '1.2' }}><div>{col.titleVi}</div><div style={{ fontSize: 10, color: '#888', fontWeight: 'normal' }}>{col.titleEn}</div></div>
        ) : getHeaderWrapper(sheetKey, col.key, prevColKey, col.isCustom, col.titleVi, col.titleEn)
      };
    });
  };

  // --- Static Column Definitions ---
  const t = (k, vi, en, render, width) => ({ key: k, dataIndex: k, titleVi: vi, titleEn: en, render, width });
  const tInp = (s, k, vi, en) => t(k, vi, en, (v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange(s, i, k, e.target.value)} />);
  const tNum = (s, k, vi, en) => t(k, vi, en, (v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange(s, i, k, e.target.value)} />);
  const tUnit = (s, k) => t(k, 'Đơn vị', 'Unit', (v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} onChange={e => handleArrayChange(s, i, k, e.target.value)} style={{width: 80, color: '#888'}} />);
  const tDate = (s) => t('date', 'Ngày', 'Date', (v, _, i) => <DatePicker value={v ? dayjs(v, 'YYYY-MM-DD') : dayjs(selectedDate, 'YYYY-MM-DD')} format="YYYY-MM-DD" onChange={(_, ds) => handleArrayChange(s, i, 'date', ds || selectedDate)} style={{width: '100%'}} />, 140);

  const getSheetColumns = (sheetKey) => {
    switch (sheetKey) {
      case 'onlineGmv': return [
        tDate(sheetKey), tInp(sheetKey, 'channel', 'Kênh', 'Channel'), tNum(sheetKey, 'target', 'Mục tiêu', 'Target'), tNum(sheetKey, 'actual', 'GMV thực tế', 'Actual GMV'), tUnit(sheetKey, 'unit_actual'),
        t('override_pct', '% Đạt', '% Achieved', (_, r, i) => <Input value={r.override_pct !== undefined ? r.override_pct : (((r.actual || 0) / (r.target || 1)) * 100).toFixed(1)} onChange={e => handleArrayChange(sheetKey, i, 'override_pct', e.target.value)} addonAfter="%" style={{ width: 100 }} />),
        t('override_variance', 'Chênh lệch', 'Variance', (_, r, i) => <Input value={r.override_variance !== undefined ? r.override_variance : ((r.actual || 0) - (r.target || 0)).toLocaleString()} onChange={e => handleArrayChange(sheetKey, i, 'override_variance', e.target.value)} style={{ width: 120 }} />),
        tInp(sheetKey, 'note', 'Ghi chú', 'Note')
      ];
      case 'onlineRoas': return [
        tDate(sheetKey), tInp(sheetKey, 'time', 'Giờ', 'Time'), tInp(sheetKey, 'channel', 'Kênh', 'Channel'),
        tNum(sheetKey, 'roas', 'ROAS', 'ROAS'),
        t('status', 'Trạng thái', 'Status', (_, r) => {
          const roas = r.roas || 0;
          const isCritical = roas < (localData.cauHinh?.roasMin || 5.5);
          return <span style={{ padding: '2px 8px', borderRadius: 4, background: isCritical ? '#f5222d' : '#52c41a', color: 'white', fontWeight: 'bold' }}>{isCritical ? 'CRITICAL' : 'NORMAL'}</span>;
        })
      ];
      case 'adsConversion': return [
        tDate(sheetKey), tInp(sheetKey, 'time', 'Giờ', 'Time'), tNum(sheetKey, 'clicks', 'Lượt click', 'Clicks'), tUnit(sheetKey, 'unit_clicks'), tNum(sheetKey, 'orders', 'Đơn hàng', 'Orders'), tUnit(sheetKey, 'unit_orders'),
        t('override_conv', 'Conv. (%)', 'Conv. (%)', (_, r, i) => <Input value={r.override_conv !== undefined ? r.override_conv : ((r.clicks || 0) > 0 ? ((r.orders || 0) / r.clicks) * 100 : 0).toFixed(2)} onChange={e => handleArrayChange(sheetKey, i, 'override_conv', e.target.value)} addonAfter="%" style={{ width: 100, fontWeight: 'bold' }} />)
      ];
      case 'inventorySku': return [
        tDate(sheetKey), tInp(sheetKey, 'sku', 'Mã SKU', 'SKU Code'), tInp(sheetKey, 'name', 'Tên sản phẩm', 'Product Name'), tNum(sheetKey, 'inventory', 'Tồn kho', 'Inventory'), tUnit(sheetKey, 'unit_inventory'), tNum(sheetKey, 'salesPerDay', 'Bán/ngày TB', 'Avg Daily Sales'), tUnit(sheetKey, 'unit_sales'),
        t('override_days', 'Số ngày tồn còn lại', 'Remaining Days', (_, r, i) => <Input value={r.override_days !== undefined ? r.override_days : ((r.salesPerDay || 0) > 0 ? ((r.inventory || 0) / r.salesPerDay) : 0).toFixed(1)} onChange={e => handleArrayChange(sheetKey, i, 'override_days', e.target.value)} style={{ width: 80, fontWeight: 'bold' }} />),
        t('status', 'Cảnh báo', 'Alert', (_, r) => {
          const days = (r.salesPerDay || 0) > 0 ? ((r.inventory || 0) / r.salesPerDay) : 0;
          const isCritical = days < (localData.cauHinh?.safetyStockDays || 3);
          return <span style={{ padding: '2px 8px', borderRadius: 4, background: isCritical ? '#f5222d' : '#52c41a', color: 'white', fontWeight: 'bold' }}>{isCritical ? 'CRITICAL' : 'NORMAL'}</span>;
        })
      ];
      case 'stockSafety': return [
        tDate(sheetKey), tNum(sheetKey, 'current', 'Tồn kho tổng', 'Total Stock'), tUnit(sheetKey, 'unit_current'), tNum(sheetKey, 'safety', 'Safety Stock (ref)', 'Safety Stock'),
        t('override_variance', 'Chênh lệch', 'Variance', (_, r, i) => <Input value={r.override_variance !== undefined ? r.override_variance : ((r.current || 0) - (r.safety || 0)).toLocaleString()} onChange={e => handleArrayChange(sheetKey, i, 'override_variance', e.target.value)} style={{ width: 120 }} />),
        t('status', 'Trạng thái', 'Status', (_, r) => {
          const isNormal = ((r.current || 0) - (r.safety || 0)) >= 0;
          return <span style={{ padding: '2px 8px', borderRadius: 4, background: isNormal ? '#52c41a' : '#f5222d', color: 'white', fontWeight: 'bold' }}>{isNormal ? 'NORMAL' : 'CRITICAL'}</span>;
        }),
        tInp(sheetKey, 'note', 'Ghi chú', 'Note')
      ];
      case 'orderStatus': return [
        tDate(sheetKey), tNum(sheetKey, 'total', 'Tổng đơn', 'Total Orders'), tUnit(sheetKey, 'unit_total'), tNum(sheetKey, 'success', 'Đơn thành công', 'Successful'), tNum(sheetKey, 'cancelled', 'Đơn huỷ', 'Cancelled'), tNum(sheetKey, 'returned', 'Đơn hoàn', 'Returned'),
        t('override_bad_pct', '% Huỷ+Hoàn', '% Bad Orders', (_, r, i) => {
          const total = r.total || 1;
          const bad = (r.cancelled || 0) + (r.returned || 0);
          return <Input value={r.override_bad_pct !== undefined ? r.override_bad_pct : ((bad / total) * 100).toFixed(1)} onChange={e => handleArrayChange(sheetKey, i, 'override_bad_pct', e.target.value)} addonAfter="%" style={{ width: 100, fontWeight: 'bold' }} />;
        }),
        tInp(sheetKey, 'note', 'Ghi chú', 'Note')
      ];
      case 'offlineTraffic': return [
        tDate(sheetKey), tInp(sheetKey, 'region', 'Khu vực', 'Region'), tInp(sheetKey, 'store', 'Điểm bán', 'Store'), tNum(sheetKey, 'shopsCheckedIn', 'Số shop check in', 'Shops Checked-in'), tUnit(sheetKey, 'unit_shops'), tInp(sheetKey, 'note', 'Ghi chú', 'Note')
      ];
      case 'offlineSales': return [
        tDate(sheetKey), tInp(sheetKey, 'region', 'Khu vực', 'Region'), tInp(sheetKey, 'store', 'Điểm bán', 'Store'), tNum(sheetKey, 'qtySold', 'Lượng hàng bán được', 'Quantity Sold'), tUnit(sheetKey, 'unit_qtySold'), tInp(sheetKey, 'note', 'Ghi chú', 'Note')
      ];
      case 'skuSampling': return [
        tDate(sheetKey), tInp(sheetKey, 'sku', 'Mã SKU', 'SKU'), tNum(sheetKey, 'qtySold', 'SL bán được', 'Qty Sold'), tUnit(sheetKey, 'unit_qtySold'), tNum(sheetKey, 'samples', 'Sample phát đi', 'Samples Distributed'), tUnit(sheetKey, 'unit_samples'),
        t('override_total', 'Tổng cộng', 'Total', (_, r, i) => <Input value={r.override_total !== undefined ? r.override_total : ((r.qtySold || 0) + (r.samples || 0))} onChange={e => handleArrayChange(sheetKey, i, 'override_total', e.target.value)} style={{ fontWeight: 'bold' }} />)
      ];
      case 'csResponse': return [
        tDate(sheetKey), tInp(sheetKey, 'shift', 'Ca', 'Shift'), tNum(sheetKey, 'tickets', 'Số ticket xử lý', 'Tickets Handled'), tUnit(sheetKey, 'unit_tickets'), tNum(sheetKey, 'responseTime', 'TB phản hồi (phút)', 'Avg Response (min)'), tNum(sheetKey, 'rating', 'Rating TB (/5)', 'Avg Rating'),
        t('status', 'Trạng thái', 'Status', (_, r) => {
          const isWarning = (r.responseTime || 0) > (localData.cauHinh?.csResponseMax || 5);
          return <span style={{ padding: '2px 8px', borderRadius: 4, background: isWarning ? '#fa8c16' : '#52c41a', color: 'white', fontWeight: 'bold' }}>{isWarning ? 'WARNING' : 'NORMAL'}</span>;
        }),
        tInp(sheetKey, 'note', 'Ghi chú', 'Note')
      ];
      case 'alertsLog': return [
        tDate(sheetKey), tInp(sheetKey, 'time', 'Giờ', 'Time'), 
        t('type', 'Mức độ', 'Severity', (v, _, i) => <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={v} style={{ background: v?.toUpperCase() === 'CRITICAL' ? '#f5222d' : '#fa8c16', color: 'white', fontWeight: 'bold', border: 'none', textAlign: 'center', padding: '0 4px' }} onChange={e => handleArrayChange(sheetKey, i, 'type', e.target.value)} />),
        tInp(sheetKey, 'message', 'Nội dung cảnh báo', 'Alert Message'), tInp(sheetKey, 'handler', 'Người xử lý', 'Handler'), tInp(sheetKey, 'action', 'Hành động', 'Action'), tInp(sheetKey, 'status', 'Trạng thái', 'Status')
      ];
      default: return [];
    }
  };

  const TAB_MAP = [
    { key: 'onlineGmv', name: '03_Online_GMV', titleVi: 'GMV Thực tế vs Mục tiêu', titleEn: 'Actual vs Target GMV', addText: 'Thêm Kênh / Add Channel', defaultRow: { date: selectedDate, channel: 'Mới', target: 0, actual: 0, note: '' } },
    { key: 'onlineRoas', name: '04_Online_ROAS', titleVi: 'Hiệu quả ROAS', titleEn: 'ROAS Performance', addText: 'Thêm Giờ / Add Time', defaultRow: { date: selectedDate, time: '00:00', channel: 'Shopee', roas: 0 } },
    { key: 'adsConversion', name: '05_Ads_Conversion', titleVi: 'Chuyển đổi Ads', titleEn: 'Ads Conversion', addText: 'Thêm Giờ / Add Time', defaultRow: { date: selectedDate, time: '00:00', clicks: 0, orders: 0 } },
    { key: 'inventorySku', name: '06_Inventory_SKU', titleVi: 'Tồn kho theo SKU', titleEn: 'SKU Inventory', addText: 'Thêm SKU / Add SKU', defaultRow: { date: selectedDate, sku: 'Mới', name: '', inventory: 0, salesPerDay: 1 } },
    { key: 'stockSafety', name: '07_Stock_Safety', titleVi: 'Cảnh báo tồn kho an toàn', titleEn: 'Safety Stock Alert', addText: 'Thêm dòng / Add Row', defaultRow: { date: selectedDate, current: 0, safety: 0, note: '' } },
    { key: 'orderStatus', name: '08_Order_Status', titleVi: 'Trạng thái đơn hàng', titleEn: 'Order Status', addText: 'Thêm dòng / Add Row', defaultRow: { date: selectedDate, total: 0, success: 0, cancelled: 0, returned: 0, note: '' } },
    { key: 'offlineTraffic', name: '09_Offline_Traffic', titleVi: 'Lưu lượng khách Offline', titleEn: 'Offline Traffic', addText: 'Thêm dòng / Add Row', defaultRow: { date: selectedDate, region: 'Miền Nam', store: 'Cửa hàng', shopsCheckedIn: 0, note: '' } },
    { key: 'offlineSales', name: '10_Offline_Sales', titleVi: 'Sản lượng Offline', titleEn: 'Offline Sales Qty', addText: 'Thêm dòng / Add Row', defaultRow: { date: selectedDate, region: 'Miền Nam', store: 'Cửa hàng', qtySold: 0, note: '' } },
    { key: 'skuSampling', name: '11_SKU_Sampling', titleVi: 'SKU Sampling', titleEn: 'SKU Sampling', addText: 'Thêm dòng / Add Row', defaultRow: { date: selectedDate, sku: 'Mã SKU', qtySold: 0, samples: 0 } },
    { key: 'csResponse', name: '12_CS_Response', titleVi: 'Phản hồi CS', titleEn: 'CS Response', addText: 'Thêm Ca / Add Shift', defaultRow: { date: selectedDate, shift: 'Mới', tickets: 0, responseTime: 0, rating: 5, note: '' } },
    { key: 'alertsLog', name: '13_Alerts_Log', titleVi: 'Nhật ký Cảnh báo', titleEn: 'Alerts Log', addText: 'Thêm Cảnh báo / Add Alert', defaultRow: { date: selectedDate, time: '00:00', type: 'CRITICAL', message: '', handler: '', action: '', status: 'Chưa xử lý' } }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Card 
        bordered={false} 
        title={<Title level={3} style={{ color: '#1890ff', margin: 0, lineHeight: 1.2 }}>Data Manager - Cập nhật dữ liệu<br/><span style={{fontSize: 14, color: '#888', fontWeight: 'normal'}}>Data Manager - Data Update</span></Title>}
        extra={
          <Space>
            <Button icon={<ExportOutlined />} onClick={exportToExcel}>Export Excel</Button>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>Lưu / Save</Button>
          </Space>
        }
      >
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          Ngày / <span style={{fontSize: 12}}>Date</span>: <b>{selectedDate}</b>. Click chuột phải vào tiêu đề cột để chèn cột tùy chỉnh / <span style={{fontSize: 12}}>Right-click column header to insert custom column</span>.
        </Text>

        <Tabs tabPosition="left" defaultActiveKey="1" activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
          <Tabs.TabPane tab="02_Cau_Hinh" key="1">
            <Title level={5} style={{lineHeight: 1.2}}>Cấu hình mục tiêu & Ngưỡng cảnh báo<br/><span style={{fontSize: 12, color: '#888', fontWeight: 'normal'}}>Target Configuration & Alert Thresholds</span></Title>
            <Table 
              dataSource={[
                { stt: 1, kpi: 'GMV mục tiêu / ngày\nDaily Target GMV', unit: 'VNĐ (triệu)', keyName: 'gmvTarget', rule: 'Tổng GMV mục tiêu Shopee + TikTok' },
                { stt: 2, kpi: 'ROAS tối thiểu\nMin ROAS', unit: 'lần', keyName: 'roasMin', rule: 'ROAS < ngưỡng -> cảnh báo CRITICAL' },
                { stt: 3, kpi: 'Thời gian phản hồi CS tối đa\nMax CS Response Time', unit: 'phút', keyName: 'csResponseMax', rule: 'CS > ngưỡng -> cảnh báo WARNING' },
                { stt: 4, kpi: 'Số ngày tồn kho an toàn\nSafety Stock Days', unit: 'ngày', keyName: 'safetyStockDays', rule: 'Stock < ngưỡng -> cảnh báo CRITICAL' },
                { stt: 5, kpi: 'Tỷ lệ huỷ đơn tối đa\nMax Cancel Rate', unit: '%', keyName: 'cancelMax', rule: 'Cancel rate > ngưỡng -> WARNING' },
                { stt: 6, kpi: 'QR Conversion tối thiểu\nMin QR Conv.', unit: '%', keyName: 'qrConvMin', rule: 'Conversion < ngưỡng -> WARNING' },
                { stt: 7, kpi: 'Tồn kho an toàn\nSafety Stock (units)', unit: 'đơn vị', keyName: 'safetyStockVal', rule: 'Mốc tham chiếu cho Bar Chart Zone B-2' },
                { stt: 8, kpi: 'Rating CS tối thiểu\nMin CS Rating', unit: '/5', keyName: 'csRatingMin', rule: 'Trung bình rating dưới ngưỡng -> WARNING' },
                { stt: 9, kpi: 'Số đơn hoàn tối đa / ngày\nMax Daily Returns', unit: 'đơn', keyName: 'returnMax', rule: 'Trigger điều tra chất lượng' }
              ]} 
              pagination={false} size="small" bordered scroll={{ x: 'max-content' }}
            >
              <Table.Column title="STT" dataIndex="stt" width={50} align="center" />
              <Table.Column title={<div style={{lineHeight: 1.2}}><div>Chỉ tiêu (KPI)</div><div style={{fontSize: 10, color:'#888'}}>Indicator</div></div>} dataIndex="kpi" render={(v) => <div style={{whiteSpace: 'pre-line'}}>{v}</div>} />
              <Table.Column title={<div style={{lineHeight: 1.2}}><div>Đơn vị</div><div style={{fontSize: 10, color:'#888'}}>Unit</div></div>} dataIndex="unit" width={100} />
              <Table.Column title={<div style={{lineHeight: 1.2}}><div>Giá trị mục tiêu</div><div style={{fontSize: 10, color:'#888'}}>Target Value</div></div>} render={(_, r) => (
                <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={localData.cauHinh?.[r.keyName]} onChange={e => handleConfigChange(r.keyName, isNaN(e.target.value) ? 0 : Number(e.target.value))} style={{ width: '100%', color: '#1890ff', fontWeight: 'bold' }} />
              )} width={150} />
              <Table.Column title={<div style={{lineHeight: 1.2}}><div>Diễn giải / Quy tắc</div><div style={{fontSize: 10, color:'#888'}}>Explanation / Rule</div></div>} dataIndex="rule" />
            </Table>
          </Tabs.TabPane>

          {TAB_MAP.map((tab, idx) => {
            const sheetKey = tab.key;
            return (
              <Tabs.TabPane tab={tab.name} key={String(idx + 2)}>
                <Title level={5} style={{lineHeight: 1.2}}>{tab.titleVi}<br/><span style={{fontSize: 12, color: '#888', fontWeight: 'normal'}}>{tab.titleEn}</span></Title>
                <Table 
                  dataSource={localData[sheetKey]?.map((r, i) => ({ ...r, key: i })) || []} 
                  columns={buildColumns(sheetKey, getSheetColumns(sheetKey))}
                  pagination={false} 
                  size="small" 
                  bordered 
                  scroll={{ x: 'max-content' }}
                  footer={() => <Button type="dashed" onClick={() => addRow(sheetKey, tab.defaultRow)} block icon={<PlusOutlined />}>{tab.addText}</Button>}
                />
              </Tabs.TabPane>
            );
          })}
        </Tabs>

        <Modal
          title="Thêm cột mới / Add New Column"
          open={isColModalOpen}
          onOk={handleConfirmInsert}
          onCancel={() => setIsColModalOpen(false)}
          okText="Thêm / Add"
          cancelText="Hủy / Cancel"
        >
          <div style={{ marginBottom: 8 }}>Tên cột / Column Name:</div>
          <Input 
            autoFocus
            value={newColName} 
            onChange={e => setNewColName(e.target.value)} 
            onPressEnter={handleConfirmInsert}
            placeholder="VD: Ghi chú 2, % Thu hồi..."
          />
        </Modal>
      </Card>
    </div>
  );
};

export default ExcelEditor;
