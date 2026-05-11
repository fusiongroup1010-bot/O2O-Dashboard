import React from 'react';
import { Row, Col, Card, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';

const ZoneOnline = ({ data, onEnlarge, customCharts = [], onDeleteChart }) => {
  // 1. GMV Bullet Chart
  const gmvData = data?.onlineGmv || [];
  const target = gmvData.reduce((acc, curr) => acc + (curr.target || 0), 0) || data?.cauHinh?.gmvTarget || 1;
  const actual = gmvData.reduce((acc, curr) => acc + (curr.actual || 0), 0);
  const gmvPercent = (actual / target) * 100;

  const bulletOption = {
    grid: { left: '10%', right: '4%', bottom: '10%', top: '10%', containLabel: true },
    xAxis: { type: 'value', max: target, splitLine: { show: false }, axisLabel: { fontSize: 10, formatter: (val) => `${val}M` } },
    yAxis: { type: 'category', data: ['GMV'], axisTick: { show: false }, axisLine: { show: false }, axisLabel: { fontSize: 11, fontWeight: 'bold' } },
    series: [
      { name: 'Target', type: 'bar', barWidth: 30, itemStyle: { color: '#e6f7ff' }, data: [target], animation: false, barGap: '-100%', z: 1 },
      { name: 'Actual', type: 'bar', barWidth: 16, itemStyle: { color: gmvPercent >= 100 ? '#52c41a' : '#1890ff' }, data: [actual], z: 2 }
    ],
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } }
  };

  const gmvChart = (
    <>
      <div style={{ textAlign: 'center', marginBottom: 5 }}>
        <span style={{ fontSize: 22, fontWeight: 'bold', color: '#1890ff' }}>
          {actual.toLocaleString()}M
        </span>
        <span style={{ color: '#888', fontSize: 14 }}> / {target.toLocaleString()}M</span>
      </div>
      <ReactECharts option={bulletOption} style={{ height: '100%', width: '100%', minHeight: 120 }} />
    </>
  );

  // 2. ROAS Gauge Chart
  const roasData = data?.onlineRoas || [];
  const totalRev = roasData.reduce((acc, curr) => acc + (curr.rev || 0), 0);
  const totalSpend = roasData.reduce((acc, curr) => acc + (curr.spend || 0), 0);
  const roas = totalSpend > 0 ? Number((totalRev / totalSpend).toFixed(2)) : 0;
  const targetRoas = data?.cauHinh?.roasMin || 5.5;

  const gaugeOption = {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 10,
        splitNumber: 5,
        itemStyle: { color: roas < targetRoas ? '#f5222d' : (roas < targetRoas + 1.5 ? '#fa8c16' : '#52c41a') },
        progress: { show: true, width: 18 },
        pointer: { icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z', length: '12%', width: 20, offsetCenter: [0, '-60%'], itemStyle: { color: 'auto' } },
        axisLine: { lineStyle: { width: 18 } },
        axisTick: { show: false },
        splitLine: { length: 15, lineStyle: { width: 2, color: '#999' } },
        axisLabel: { distance: 20, color: '#999', fontSize: 12 },
        detail: { valueAnimation: true, formatter: '{value}', color: 'auto', fontSize: 32, offsetCenter: [0, '40%'] },
        data: [{ value: roas }]
      }
    ]
  };

  const roasChart = (
    <div style={{ position: 'relative', height: '100%', width: '100%', minHeight: 180 }}>
      <ReactECharts option={gaugeOption} style={{ height: '100%', width: '100%' }} />
      <div style={{ position: 'absolute', bottom: 10, width: '100%', textAlign: 'center', color: roas < targetRoas ? 'red' : '#888', fontWeight: 'bold' }}>
        Target: {targetRoas}
      </div>
    </div>
  );

  // 3. Ads vs Conversion
  const adsChartData = (data?.adsConversion || []).map(item => ({
    time: item.time,
    conversion: item.clicks > 0 ? Number(((item.orders / item.clicks) * 100).toFixed(2)) : 0
  }));

  const adsChart = (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={adsChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="time" fontSize={11} />
        <YAxis orientation="left" fontSize={11} tickFormatter={(v) => `${v}%`} />
        <RechartsTooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 11, bottom: -10 }} />
        <Line type="monotone" dataKey="conversion" name="Conv. (%)" stroke="#1890ff" strokeWidth={3} dot={{ r: 4 }} />
      </LineChart>
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
        <Card title={getTitle('[1] GMV Thực tế / Mục tiêu', 'GMV Target vs Actual')} size="small" bordered={false} hoverable onClick={() => onEnlarge(getTitle('[1] GMV Thực tế / Mục tiêu', 'GMV Target vs Actual'), gmvChart)} bodyStyle={cardBodyStyle}>
          {gmvChart}
        </Card>
      </Col>
      <Col span={24}>
        <Card title={getTitle('[2] ROAS Thời gian thực', 'ROAS Real-time')} size="small" bordered={false} hoverable onClick={() => onEnlarge(getTitle('[2] ROAS Thời gian thực', 'ROAS Real-time'), roasChart)} bodyStyle={cardBodyStyle}>
          {roasChart}
        </Card>
      </Col>
      <Col span={24}>
        <Card title={getTitle('[3] Tỷ lệ Chuyển đổi (Conv. %)', 'Conversion Rate')} size="small" bordered={false} hoverable onClick={() => onEnlarge(getTitle('[3] Tỷ lệ Chuyển đổi (Conv. %)', 'Conversion Rate'), <div style={{height: 400}}>{adsChart}</div>)} bodyStyle={cardBodyStyle}>
          {adsChart}
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

export default ZoneOnline;
