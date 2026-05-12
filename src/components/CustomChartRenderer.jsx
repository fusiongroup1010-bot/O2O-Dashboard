import React from 'react';
import { 
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis, Legend
} from 'recharts';
import ReactECharts from 'echarts-for-react';
import { enrichChartData } from '../config/dashboardConfig';
import CustomTooltip from './CustomTooltip';

const COLORS = ['#1890ff', '#fa8c16', '#52c41a', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96'];

const CustomChartRenderer = ({ chart, chartData }) => {
  if (!chart || !chartData) return null;

  const enrichedData = enrichChartData(chart.sheetKey, chartData);
  const yAxes = Array.isArray(chart.yAxis) ? chart.yAxis : [chart.yAxis];

  switch (chart.type) {
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={enrichedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={chart.xAxis} fontSize={11} />
            <YAxis fontSize={11} />
            <RechartsTooltip content={<CustomTooltip sheetKey={chart.sheetKey} />} cursor={{ fill: '#e6f7ff' }} />
            {yAxes.length > 1 && <Legend iconType="circle" wrapperStyle={{ fontSize: 11, bottom: -10 }} />}
            {yAxes.map((y, index) => (
              <Bar key={y} dataKey={y} fill={COLORS[index % COLORS.length]} radius={yAxes.length === 1 ? [4, 4, 0, 0] : 0} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );
    case 'stacked_bar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={enrichedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={chart.xAxis} fontSize={11} />
            <YAxis fontSize={11} />
            <RechartsTooltip content={<CustomTooltip sheetKey={chart.sheetKey} />} cursor={{ fill: '#e6f7ff' }} />
            {yAxes.length > 1 && <Legend iconType="circle" wrapperStyle={{ fontSize: 11, bottom: -10 }} />}
            {yAxes.map((y, index) => (
              <Bar key={y} dataKey={y} stackId="a" fill={COLORS[index % COLORS.length]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );
    case 'line':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={enrichedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={chart.xAxis} fontSize={11} />
            <YAxis fontSize={11} />
            <RechartsTooltip content={<CustomTooltip sheetKey={chart.sheetKey} />} />
            {yAxes.length > 1 && <Legend iconType="circle" wrapperStyle={{ fontSize: 11, bottom: -10 }} />}
            {yAxes.map((y, index) => (
              <Line key={y} type="monotone" dataKey={y} stroke={COLORS[index % COLORS.length]} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );
    case 'pie':
      const pieY = yAxes[0];
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={enrichedData} 
              cx="50%" cy="50%" 
              outerRadius={60} 
              dataKey={pieY} 
              nameKey={chart.xAxis} 
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
              style={{ fontSize: 10 }}
            >
              {enrichedData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip content={<CustomTooltip sheetKey={chart.sheetKey} />} />
          </PieChart>
        </ResponsiveContainer>
      );
    case 'gauge':
      const gaugeY = yAxes[0];
      const lastVal = enrichedData.length > 0 ? Number(enrichedData[enrichedData.length - 1][gaugeY]) : 0;
      const gaugeOption = {
        tooltip: {
          formatter: `{b} : {c}`
        },
        series: [{
          name: gaugeY,
          type: 'gauge',
          startAngle: 200,
          endAngle: -20,
          pointer: { show: true, length: '60%', width: 5 },
          progress: { show: true, width: 10, itemStyle: { color: '#1890ff' } },
          axisLine: { lineStyle: { width: 10 } },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          detail: { 
            valueAnimation: true, 
            formatter: '{value}', 
            fontSize: 24, 
            fontWeight: 'bold', 
            color: '#1890ff', 
            offsetCenter: [0, '70%'] 
          },
          data: [{ name: gaugeY, value: lastVal }]
        }]
      };
      return <ReactECharts option={gaugeOption} style={{ height: '100%', width: '100%' }} />;
    case 'bubble':
      const bubY = yAxes[0];
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={chart.xAxis} name={chart.xAxis} fontSize={11} />
            <YAxis dataKey={bubY} name={bubY} fontSize={11} />
            <ZAxis dataKey={bubY} range={[50, 400]} />
            <RechartsTooltip content={<CustomTooltip sheetKey={chart.sheetKey} />} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name={chart.title} data={enrichedData} fill="#1890ff" />
          </ScatterChart>
        </ResponsiveContainer>
      );
    default:
      return <div>Loại biểu đồ không hỗ trợ / Unsupported chart type</div>;
  }
};

export default CustomChartRenderer;
