export const mockData = {
  cauHinh: { gmvTarget: 1000, roasMin: 5.5, csResponseMax: 5, safetyStockDays: 3, cancelMax: 15, qrConvMin: 15, adsMax: 60, safetyStockVal: 4500, csRatingMin: 4.5, returnMax: 50 },
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
    { time: '08:00', spend: 50, clicks: 1200, orders: 15 },
    { time: '10:00', spend: 120, clicks: 2500, orders: 28 },
    { time: '12:00', spend: 450, clicks: 5800, orders: 70 },
    { time: '14:00', spend: 510, clicks: 6200, orders: 95 },
    { time: '16:00', spend: 430, clicks: 5200, orders: 110 },
    { time: '18:00', spend: 380, clicks: 4900, orders: 135 },
    { time: '20:00', spend: 590, clicks: 7000, orders: 220 }
  ],
  inventorySku: [
    { sku: 'SKU-01', name: 'Hạt khô Adult 1kg', ads: 750, inventory: 800, salesPerDay: 60 },
    { sku: 'SKU-02', name: 'Pate gà 100g', ads: 380, inventory: 350, salesPerDay: 90 },
    { sku: 'SKU-03', name: 'Snack thưởng 50g', ads: 250, inventory: 1500, salesPerDay: 120 },
    { sku: 'SKU-04', name: 'Cát vệ sinh 5L', ads: 1080, inventory: 80, salesPerDay: 25 }
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
    { time: '08:00', location: 'Cửa hàng Q1', visitors: 5, note: '' },
    { time: '10:00', location: 'Cửa hàng Q1', visitors: 25, note: '' },
    { time: '12:00', location: 'Cửa hàng Q1', visitors: 130, note: '' },
    { time: '14:00', location: 'Cửa hàng Q1', visitors: 75, note: '' },
    { time: '16:00', location: 'Cửa hàng Q1', visitors: 90, note: '' },
    { time: '18:00', location: 'Cửa hàng Q1', visitors: 200, note: '' },
    { time: '20:00', location: 'Cửa hàng Q1', visitors: 245, note: '' }
  ],
  qrFunnel: [
    { campaign: 'Event Mall Q1', scan: 1000, voucher: 600, cart: 300, checkout: 150 }
  ],
  gmvChannel: [
    { date: '30-04-2026', dayOfWeek: 'T2', online: 350, offline: 200, o2o: 80 },
    { date: '01-05-2026', dayOfWeek: 'T3', online: 380, offline: 210, o2o: 90 },
    { date: '02-05-2026', dayOfWeek: 'T4', online: 580, offline: 270, o2o: 130 },
    { date: '03-05-2026', dayOfWeek: 'T5', online: 540, offline: 260, o2o: 120 },
    { date: '04-05-2026', dayOfWeek: 'T6', online: 850, offline: 350, o2o: 180 },
    { date: '05-05-2026', dayOfWeek: 'T7', online: 1100, offline: 480, o2o: 250 },
    { date: '06-05-2026', dayOfWeek: 'CN', online: 1250, offline: 510, o2o: 280 }
  ],
  alertsLog: [
    { time: '09:15', type: 'CRITICAL', message: 'TikTok ROAS 4.8 (< target 5.5)', handler: 'Ads Operator', action: 'Pause Ads', status: 'Đã xử lý' },
    { time: '11:30', type: 'WARNING', message: 'CS Response 8 phút (> 5)', handler: 'CS Lead', action: 'Enable Chatbot', status: 'Đang xử lý' },
    { time: '14:00', type: 'CRITICAL', message: 'SKU-04 còn tồn 2 ngày', handler: 'WMS Manager', action: 'Transfer Stock', status: 'Đã xử lý' }
  ]
};
