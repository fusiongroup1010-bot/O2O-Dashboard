export const mockData = {
  cauHinh: { gmvTarget: 1000, roasMin: 5.5, csResponseMax: 5, safetyStockDays: 3, cancelMax: 15, qrConvMin: 15, adsMax: 60, safetyStockVal: 4500, csRatingMin: 4.5, returnMax: 50 },
  customColumns: {},
  customCharts: [],
  onlineGmv: [
    { channel: 'Shopee', target: 600, actual: 510, note: 'Khuyến mãi đầu tháng' },
    { channel: 'TikTok', target: 400, actual: 340, note: 'ROAS thấp - đề xuất giảm Ads' }
  ],
  onlineRoas: [
    { time: '08:00', channel: 'TikTok', rev: 320, spend: 70 },
    { time: '10:00', channel: 'TikTok', rev: 290, spend: 75 },
    { time: '12:00', channel: 'TikTok', rev: 240, spend: 50 },
    { time: '14:00', channel: 'Shopee', rev: 410, spend: 80 }
  ],
  adsConversion: [
    { time: '08:00', clicks: 1200, orders: 15 },
    { time: '10:00', clicks: 2500, orders: 28 },
    { time: '12:00', clicks: 5800, orders: 70 },
    { time: '14:00', clicks: 6200, orders: 95 },
    { time: '16:00', clicks: 5200, orders: 110 },
    { time: '18:00', clicks: 4900, orders: 135 },
    { time: '20:00', clicks: 7000, orders: 220 }
  ],
  inventorySku: [
    { sku: 'SKU-01', name: 'Hạt khô Adult 1kg', inventory: 800, salesPerDay: 60 },
    { sku: 'SKU-02', name: 'Pate gà 100g', inventory: 350, salesPerDay: 90 },
    { sku: 'SKU-03', name: 'Snack thưởng 50g', inventory: 1500, salesPerDay: 120 },
    { sku: 'SKU-04', name: 'Cát vệ sinh 5L', inventory: 80, salesPerDay: 25 }
  ],
  csResponse: [
    { shift: 'Sáng', tickets: 120, responseTime: 4.2, rating: 4.7, note: '' },
    { shift: 'Chiều', tickets: 145, responseTime: 8, rating: 4.3, note: 'Quá tải' }
  ],
  stockSafety: [
    { current: 4500, safety: 60, note: '' }
  ],
  orderStatus: [
    { total: 1200, success: 1020, cancelled: 130, returned: 50, note: '' }
  ],
  offlineTraffic: [
    { region: 'Miền Nam', store: 'Cửa hàng Q1', shopsCheckedIn: 5, note: '' },
    { region: 'Miền Nam', store: 'Cửa hàng Q3', shopsCheckedIn: 8, note: '' },
    { region: 'Miền Bắc', store: 'Cửa hàng HN', shopsCheckedIn: 12, note: '' }
  ],
  offlineSales: [
    { region: 'Miền Nam', store: 'Cửa hàng Q1', qtySold: 150, note: '' },
    { region: 'Miền Nam', store: 'Cửa hàng Q3', qtySold: 200, note: '' },
    { region: 'Miền Bắc', store: 'Cửa hàng HN', qtySold: 300, note: '' }
  ],
  skuSampling: [
    { sku: 'SKU-01', qtySold: 50, samples: 10, total: 60 },
    { sku: 'SKU-02', qtySold: 120, samples: 30, total: 150 },
    { sku: 'SKU-03', qtySold: 80, samples: 20, total: 100 }
  ],
  alertsLog: [
    { time: '09:15', type: 'CRITICAL', message: 'TikTok ROAS 4.8 (< target 5.5)', handler: 'Ads Operator', action: 'Pause Ads', status: 'Đã xử lý' },
    { time: '11:30', type: 'WARNING', message: 'CS Response 8 phút (> 5)', handler: 'CS Lead', action: 'Enable Chatbot', status: 'Đang xử lý' },
    { time: '14:00', type: 'CRITICAL', message: 'SKU-04 còn tồn 2 ngày', handler: 'WMS Manager', action: 'Transfer Stock', status: 'Đã xử lý' }
  ]
};
