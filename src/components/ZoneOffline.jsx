import React from 'react';
import { Row, Col, Card } from 'antd';
import ReactECharts from 'echarts-for-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer
} from 'recharts';

const ZoneOffline = ({ data, onEnlarge }) => {

  const trafficData = data?.offlineTraffic || [];
  const trafficChart = (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={trafficData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="store" fontSize={11} />
        <YAxis fontSize={11} />
        <RechartsTooltip cursor={{ fill: '#e6f7ff' }} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
        <Bar dataKey="shopsCheckedIn" name="Shops Checked-in" fill="#1890ff" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  const salesData = data?.offlineSales || [];
  const salesChart = (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={salesData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="store" fontSize={11} />
        <YAxis fontSize={11} />
        <RechartsTooltip cursor={{ fill: '#e6f7ff' }} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
        <Bar dataKey="qtySold" name="Quantity Sold" fill="#52c41a" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  const skuData = data?.skuSampling || [];
  const skuChart = (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={skuData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="sku" fontSize={11} />
        <YAxis fontSize={11} />
        <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 11, bottom: -10 }} />
        <Bar dataKey="qtySold" name="Qty Sold" stackId="a" fill="#1890ff" />
        <Bar dataKey="samples" name="Samples" stackId="a" fill="#fa8c16" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
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
        <Card title={getTitle('[1] Số Shop Check-in', 'Shops Checked-in')} size="small" bordered={false} hoverable onClick={() => onEnlarge(getTitle('[1] Số Shop Check-in', 'Shops Checked-in'), <div style={{height: 400}}>{trafficChart}</div>)} bodyStyle={cardBodyStyle}>
          {trafficChart}
        </Card>
      </Col>
      <Col span={24}>
        <Card title={getTitle('[2] Sản lượng bán Offline', 'Offline Sales Qty')} size="small" bordered={false} hoverable onClick={() => onEnlarge(getTitle('[2] Sản lượng bán Offline', 'Offline Sales Qty'), <div style={{height: 400}}>{salesChart}</div>)} bodyStyle={cardBodyStyle}>
          {salesChart}
        </Card>
      </Col>
      <Col span={24}>
        <Card title={getTitle('[3] Đóng góp SKU & Sample', 'SKU Sales & Samples')} size="small" bordered={false} hoverable onClick={() => onEnlarge(getTitle('[3] Đóng góp SKU & Sample', 'SKU Sales & Samples'), <div style={{height: 400}}>{skuChart}</div>)} bodyStyle={cardBodyStyle}>
          {skuChart}
        </Card>
      </Col>
    </Row>
  );
};

export default ZoneOffline;
