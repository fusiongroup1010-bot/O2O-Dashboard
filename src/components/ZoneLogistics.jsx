import React from 'react';
import { Row, Col, Card, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import {
  ComposedChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ReferenceLine, PieChart, Pie, Cell
} from 'recharts';

const ZoneLogistics = ({ data, onEnlarge, customCharts = [], onDeleteChart }) => {
  const COLORS = ['#1890ff', '#fa8c16'];

  const adsVsInvData = data?.inventorySku || [];
  const adsVsInvChart = (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={adsVsInvData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="sku" fontSize={11} />
        <YAxis yAxisId="left" fontSize={11} />
        <YAxis yAxisId="right" orientation="right" fontSize={11} tickFormatter={(v) => `$${v}`} />
        <RechartsTooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 11, bottom: -10 }} />
        <Bar yAxisId="left" dataKey="inventory" name="Inventory" fill="#1890ff" barSize={20} radius={[4, 4, 0, 0]} />
        <Line yAxisId="right" type="monotone" dataKey="ads" name="Ads ($)" stroke="#fa8c16" strokeWidth={3} dot={{ r: 4 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );

  const stockSafetyRaw = data?.stockSafety || [];
  const stockRow = stockSafetyRaw[0] || { current: 0, safety: 0 };
  const globalSafetyStock = data?.cauHinh?.safetyStockVal || 4500;
  const stockSafetyData = [{ name: 'Tổng Kho', current: stockRow.current, safety: globalSafetyStock }];
  const maxStock = Math.max(stockRow.current || 0, globalSafetyStock || 0);

  const stockChart = (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={stockSafetyData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" fontSize={11} />
        <YAxis fontSize={11} domain={[0, maxStock + 1000]} />
        <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
        <Bar dataKey="current" name="Current Stock" fill={stockRow.current < globalSafetyStock ? '#f5222d' : '#1890ff'} barSize={60} radius={[4, 4, 0, 0]} />
        <ReferenceLine y={globalSafetyStock} label={{ position: 'top', value: 'Safety', fill: '#fa8c16', fontSize: 11, fontWeight: 'bold' }} stroke="#fa8c16" strokeDasharray="3 3" strokeWidth={2} />
      </BarChart>
    </ResponsiveContainer>
  );

  const orderRaw = data?.orderStatus || [];
  const orderRow = orderRaw[0] || { success: 0, cancelled: 0, returned: 0 };
  const cancelData = [
    { status: 'Thành công', value: orderRow.success || 0 },
    { status: 'Huỷ/Hoàn', value: (orderRow.cancelled || 0) + (orderRow.returned || 0) }
  ];

  const pieChart = (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={cancelData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value" nameKey="status" label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`} labelLine={false} style={{fontSize: 11}}>
          {cancelData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <RechartsTooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
      </PieChart>
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
        <Card title={getTitle('[1] Chi phí Ads & Tồn kho', 'Ads Spend vs Inventory')} size="small" bordered={false} hoverable onClick={() => onEnlarge(getTitle('[1] Chi phí Ads & Tồn kho', 'Ads Spend vs Inventory'), <div style={{height: 400}}>{adsVsInvChart}</div>)} bodyStyle={cardBodyStyle}>
          {adsVsInvChart}
        </Card>
      </Col>
      <Col span={24}>
        <Card title={getTitle('[2] Mức tồn kho & Cảnh báo', 'Stock vs Safety Stock')} size="small" bordered={false} hoverable onClick={() => onEnlarge(getTitle('[2] Mức tồn kho & Cảnh báo', 'Stock vs Safety Stock'), <div style={{height: 400}}>{stockChart}</div>)} bodyStyle={cardBodyStyle}>
          {stockChart}
        </Card>
      </Col>
      <Col span={24}>
        <Card title={getTitle('[3] Tỷ lệ Huỷ / Hoàn đơn', 'Cancel / Return Rate')} size="small" bordered={false} hoverable onClick={() => onEnlarge(getTitle('[3] Tỷ lệ Huỷ / Hoàn đơn', 'Cancel / Return Rate'), <div style={{height: 400}}>{pieChart}</div>)} bodyStyle={cardBodyStyle}>
          {pieChart}
        </Card>
      </Col>
      {customCharts.map(chart => {
        const chartData = data[chart.sheetKey] || [];
        const content = (
          <ResponsiveContainer width="100%" height="100%">
            {chart.type === 'bar' ? (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey={chart.xAxis} fontSize={11} />
                <YAxis fontSize={11} />
                <RechartsTooltip cursor={{ fill: '#e6f7ff' }} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey={chart.yAxis} fill="#1890ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey={chart.xAxis} fontSize={11} />
                <YAxis fontSize={11} />
                <RechartsTooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey={chart.yAxis} stroke="#1890ff" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        );
        return (
          <Col span={24} key={chart.id}>
            <Card 
              title={getTitle(chart.title, 'Custom Chart')} 
              size="small" bordered={false} 
              extra={<Button type="text" danger icon={<DeleteOutlined />} onClick={(e) => { e.stopPropagation(); onDeleteChart(chart.id); }} />}
              hoverable 
              onClick={() => onEnlarge(getTitle(chart.title, 'Custom Chart'), <div style={{height: 400}}>{content}</div>)} 
              bodyStyle={cardBodyStyle}
            >
              {content}
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default ZoneLogistics;
