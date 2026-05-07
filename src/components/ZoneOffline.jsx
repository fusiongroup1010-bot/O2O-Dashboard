import React from 'react';
import { Row, Col, Card } from 'antd';
import ReactECharts from 'echarts-for-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer
} from 'recharts';

const ZoneOffline = ({ data, onEnlarge }) => {

  const qrRaw = data?.qrFunnel || [];
  const qrRow = qrRaw[0] || { scan: 0, voucher: 0, cart: 0, checkout: 0 };
  const qrData = [
    { step: 'Scan QR', count: qrRow.scan || 0 },
    { step: 'Collect Voucher', count: qrRow.voucher || 0 },
    { step: 'Add to Cart', count: qrRow.cart || 0 },
    { step: 'Checkout', count: qrRow.checkout || 0 }
  ];

  const waterfallData = [
    0, 
    qrData[1].count, 
    qrData[2].count, 
    qrData[3].count
  ];

  const actualWaterfallOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '15%', right: '4%', bottom: '25%', top: '15%', containLabel: true },
    xAxis: { type: 'category', data: qrData.map(item => item.step), axisLabel: { interval: 0, rotate: 20, fontSize: 10 } },
    yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
    series: [
      {
        name: 'Placeholder',
        type: 'bar',
        stack: 'Total',
        itemStyle: { borderColor: 'transparent', color: 'transparent' },
        emphasis: { itemStyle: { borderColor: 'transparent', color: 'transparent' } },
        data: waterfallData
      },
      {
        name: 'Volume',
        type: 'bar',
        stack: 'Total',
        label: { show: true, position: 'top', fontSize: 11 },
        itemStyle: { color: '#1890ff' }, 
        data: qrData.map(item => item.count)
      }
    ]
  };

  const trafficData = data?.offlineTraffic || [];
  const trafficChart = (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={trafficData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="time" fontSize={11} />
        <YAxis fontSize={11} />
        <RechartsTooltip cursor={{ fill: '#e6f7ff' }} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
        <Bar dataKey="visitors" name="Visitors" fill="#1890ff" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  const gmvData = data?.gmvChannel || [];
  const gmvChart = (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={gmvData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" fontSize={11} />
        <YAxis fontSize={11} tickFormatter={(v) => `${v}`} />
        <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 11, bottom: -10 }} />
        <Bar dataKey="online" name="Online" stackId="a" fill="#1890ff" />
        <Bar dataKey="offline" name="Offline" stackId="a" fill="#fa8c16" />
        <Bar dataKey="o2o" name="O2O" stackId="a" fill="#52c41a" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  const qrChart = (
    <ReactECharts option={actualWaterfallOption} style={{ height: '100%', width: '100%', minHeight: 180 }} />
  );

  const getTitle = (vi, en) => (
    <div style={{ lineHeight: '1.2' }}>
      <div style={{ fontSize: 14 }}>{vi}</div>
      <div style={{ fontSize: 11, color: '#888', fontWeight: 'normal' }}>{en}</div>
    </div>
  );

  const cardBodyStyle = { padding: 12, height: 220, display: 'flex', flexDirection: 'column', justifyContent: 'center' };

  return (
    <Row gutter={[0, 16]}>
      <Col span={24}>
        <Card title={getTitle('[1] Lưu lượng khách hàng', 'Offline Traffic')} size="small" bordered={false} hoverable onClick={() => onEnlarge(getTitle('[1] Lưu lượng khách hàng', 'Offline Traffic'), <div style={{height: 400}}>{trafficChart}</div>)} bodyStyle={cardBodyStyle}>
          {trafficChart}
        </Card>
      </Col>
      <Col span={24}>
        <Card title={getTitle('[2] Phễu chuyển đổi QR', 'QR Scan Conversion')} size="small" bordered={false} hoverable onClick={() => onEnlarge(getTitle('[2] Phễu chuyển đổi QR', 'QR Scan Conversion'), <div style={{height: 400}}>{qrChart}</div>)} bodyStyle={cardBodyStyle}>
          {qrChart}
        </Card>
      </Col>
      <Col span={24}>
        <Card title={getTitle('[3] Đóng góp doanh thu', 'Contribution to GMV')} size="small" bordered={false} hoverable onClick={() => onEnlarge(getTitle('[3] Đóng góp doanh thu', 'Contribution to GMV'), <div style={{height: 400}}>{gmvChart}</div>)} bodyStyle={cardBodyStyle}>
          {gmvChart}
        </Card>
      </Col>
    </Row>
  );
};

export default ZoneOffline;
