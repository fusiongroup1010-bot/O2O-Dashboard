import dayjs from 'dayjs';

const selectedDate = dayjs().format('YYYY-MM-DD'); // Default, though usually passed from context

export const TAB_MAP = [
  { key: 'onlineGmv', group: 'Sale Online', name: '03_Online_GMV', titleVi: 'GMV Thực tế vs Mục tiêu', titleEn: 'Actual vs Target GMV', addText: 'Thêm Kênh / Add Channel', defaultRow: { date: selectedDate, channel: 'Mới', target: 0, actual: 0, note: '' } },
  { key: 'onlineRoas', group: 'Sale Online', name: '04_Online_ROAS', titleVi: 'Hiệu quả ROAS', titleEn: 'ROAS Performance', addText: 'Thêm Giờ / Add Time', defaultRow: { date: selectedDate, time: '00:00', channel: 'Shopee', roas: 0 } },
  { key: 'adsConversion', group: 'Sale Online', name: '05_Ads_Conversion', titleVi: 'Chuyển đổi Ads', titleEn: 'Ads Conversion', addText: 'Thêm Giờ / Add Time', defaultRow: { date: selectedDate, time: '00:00', clicks: 0, orders: 0 } },
  { key: 'inventorySku', group: 'Logistics', name: '06_Inventory_SKU', titleVi: 'Tồn kho theo SKU', titleEn: 'SKU Inventory', addText: 'Thêm SKU / Add SKU', defaultRow: { date: selectedDate, sku: 'Mới', name: '', inventory: 0, salesPerDay: 1 } },
  { key: 'stockSafety', group: 'Logistics', name: '07_Stock_Safety', titleVi: 'Cảnh báo tồn kho an toàn', titleEn: 'Safety Stock Alert', addText: 'Thêm dòng / Add Row', defaultRow: { date: selectedDate, current: 0, safety: 0, note: '' } },
  { key: 'orderStatus', group: 'Logistics', name: '08_Order_Status', titleVi: 'Trạng thái đơn hàng', titleEn: 'Order Status', addText: 'Thêm dòng / Add Row', defaultRow: { date: selectedDate, total: 0, success: 0, cancelled: 0, returned: 0, note: '' } },
  { key: 'offlineTraffic', group: 'Sale Offline', name: '09_Offline_Checkin Shop', titleVi: 'Lưu lượng khách Offline', titleEn: 'Offline Traffic', addText: 'Thêm dòng / Add Row', defaultRow: { date: selectedDate, region: 'Miền Nam', store: 'Cửa hàng', shopsCheckedIn: 0, note: '' } },
  { key: 'offlineSales', group: 'Sale Offline', name: '10_Offline_Sales', titleVi: 'Sản lượng Offline', titleEn: 'Offline Sales Qty', addText: 'Thêm dòng / Add Row', defaultRow: { date: selectedDate, region: 'Miền Nam', store: 'Cửa hàng', qtySold: 0, note: '' } },
  { key: 'skuSampling', group: 'Sale Offline', name: '11_SKU_Sample_Quantity', titleVi: 'SKU Sampling', titleEn: 'SKU Sampling', addText: 'Thêm dòng / Add Row', defaultRow: { date: selectedDate, sku: 'Mã SKU', qtySold: 0, quycach: '1', samples: 0, quycach_sample: '1' } },
  { key: 'csResponse', group: 'CS', name: '12_CS_Response', titleVi: 'Phản hồi CS', titleEn: 'CS Response', addText: 'Thêm Ca / Add Shift', defaultRow: { date: selectedDate, shift: 'Mới', tickets: 0, responseTime: 0, rating: 5, note: '' } },
  { key: 'alertsLog', group: 'Hệ thống', name: '13_Alerts_Log', titleVi: 'Nhật ký Cảnh báo', titleEn: 'Alerts Log', addText: 'Thêm Cảnh báo / Add Alert', defaultRow: { date: selectedDate, time: '00:00', type: 'CRITICAL', message: '', handler: '', action: '', status: 'Chưa xử lý' } }
];

export const SHEET_COLUMNS = {
  onlineGmv: [
    { key: 'date', label: 'Ngày' },
    { key: 'channel', label: 'Kênh' },
    { key: 'target', label: 'Mục tiêu' },
    { key: 'actual', label: 'GMV thực tế', unitKey: 'unit_actual' },
    { key: 'override_pct', label: '% Đạt (Tính toán)' },
    { key: 'override_variance', label: 'Chênh lệch (Tính toán)' }
  ],
  onlineRoas: [
    { key: 'date', label: 'Ngày' },
    { key: 'time', label: 'Giờ' },
    { key: 'channel', label: 'Kênh' },
    { key: 'roas', label: 'ROAS' }
  ],
  adsConversion: [
    { key: 'date', label: 'Ngày' },
    { key: 'time', label: 'Giờ' },
    { key: 'clicks', label: 'Lượt click', unitKey: 'unit_clicks' },
    { key: 'orders', label: 'Đơn hàng', unitKey: 'unit_orders' },
    { key: 'override_conv', label: 'Tỷ lệ chuyển đổi (%) (Tính toán)' }
  ],
  inventorySku: [
    { key: 'date', label: 'Ngày' },
    { key: 'sku', label: 'Mã SKU' },
    { key: 'name', label: 'Tên sản phẩm' },
    { key: 'inventory', label: 'Tồn kho', unitKey: 'unit_inventory' },
    { key: 'salesPerDay', label: 'Bán/ngày TB', unitKey: 'unit_sales' },
    { key: 'override_days', label: 'Số ngày tồn còn lại (Tính toán)' }
  ],
  stockSafety: [
    { key: 'date', label: 'Ngày' },
    { key: 'current', label: 'Tồn kho tổng', unitKey: 'unit_current' },
    { key: 'safety', label: 'Safety Stock (ref)' },
    { key: 'override_variance', label: 'Chênh lệch (Tính toán)' }
  ],
  orderStatus: [
    { key: 'date', label: 'Ngày' },
    { key: 'total', label: 'Tổng đơn', unitKey: 'unit_total' },
    { key: 'success', label: 'Đơn thành công' },
    { key: 'cancelled', label: 'Đơn huỷ' },
    { key: 'returned', label: 'Đơn hoàn' },
    { key: 'override_bad_pct', label: '% Huỷ+Hoàn (Tính toán)' }
  ],
  offlineTraffic: [
    { key: 'date', label: 'Ngày' },
    { key: 'region', label: 'Khu vực' },
    { key: 'store', label: 'Điểm bán' },
    { key: 'shopsCheckedIn', label: 'Số shop check in', unitKey: 'unit_shops' }
  ],
  offlineSales: [
    { key: 'date', label: 'Ngày' },
    { key: 'region', label: 'Khu vực' },
    { key: 'store', label: 'Điểm bán' },
    { key: 'qtySold', label: 'Lượng hàng bán được', unitKey: 'unit_qtySold' }
  ],
  skuSampling: [
    { key: 'date', label: 'Ngày' },
    { key: 'sku', label: 'Mã SKU' },
    { key: 'qtySold', label: 'SL bán được', unitKey: 'unit_qtySold' },
    { key: 'quycach', label: 'Quy cách' },
    { key: 'totalVolumeSold', label: 'Tổng KL bán (Tính toán)' },
    { key: 'samples', label: 'Sample phát đi', unitKey: 'unit_samples' },
    { key: 'quycach_sample', label: 'Quy cách Sample' },
    { key: 'totalVolumeSample', label: 'Tổng KL Sample (Tính toán)' },
    { key: 'override_total', label: 'Tổng cộng KL (Tính toán)' }
  ],
  csResponse: [
    { key: 'date', label: 'Ngày' },
    { key: 'shift', label: 'Ca' },
    { key: 'tickets', label: 'Số ticket xử lý', unitKey: 'unit_tickets' },
    { key: 'responseTime', label: 'TB phản hồi (phút)' },
    { key: 'rating', label: 'Rating TB (/5)' }
  ],
  alertsLog: [
    { key: 'date', label: 'Ngày' },
    { key: 'time', label: 'Giờ' },
    { key: 'type', label: 'Mức độ' },
    { key: 'message', label: 'Nội dung cảnh báo' },
    { key: 'handler', label: 'Người xử lý' },
    { key: 'action', label: 'Hành động' },
    { key: 'status', label: 'Trạng thái' }
  ]
};

export const parseWeightToKg = (valStr) => {
  if (!valStr) return 0;
  const str = String(valStr).toLowerCase().trim();
  const num = parseFloat(str) || 0;
  if (str.includes('tấn') || str.includes('ton')) return num * 1000;
  if (str.endsWith('g') && !str.endsWith('kg')) return num / 1000;
  return num; 
};

export const enrichChartData = (sheetKey, data) => {
  if (!data || !Array.isArray(data)) return [];
  return data.map(row => {
    const newRow = { ...row };
    if (sheetKey === 'skuSampling') {
      newRow.totalVolumeSold = parseWeightToKg(row.quycach) * (parseFloat(row.qtySold) || 0);
      newRow.totalVolumeSample = parseWeightToKg(row.quycach_sample) * (parseFloat(row.samples) || 0);
      newRow.override_total = newRow.totalVolumeSold + newRow.totalVolumeSample;
    }
    if (sheetKey === 'onlineGmv') {
      newRow.override_pct = ((parseFloat(row.actual) || 0) / (parseFloat(row.target) || 1)) * 100;
      newRow.override_variance = (parseFloat(row.actual) || 0) - (parseFloat(row.target) || 0);
    }
    if (sheetKey === 'adsConversion') {
      newRow.override_conv = (parseFloat(row.clicks) || 0) > 0 ? ((parseFloat(row.orders) || 0) / parseFloat(row.clicks)) * 100 : 0;
    }
    if (sheetKey === 'inventorySku') {
      newRow.override_days = (parseFloat(row.salesPerDay) || 0) > 0 ? (parseFloat(row.inventory) || 0) / parseFloat(row.salesPerDay) : 0;
    }
    if (sheetKey === 'stockSafety') {
      newRow.override_variance = (parseFloat(row.current) || 0) - (parseFloat(row.safety) || 0);
    }
    if (sheetKey === 'orderStatus') {
      const bad = (parseFloat(row.cancelled) || 0) + (parseFloat(row.returned) || 0);
      newRow.override_bad_pct = (bad / (parseFloat(row.total) || 1)) * 100;
    }
    return newRow;
  });
};
