import React from 'react';
import { 
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';
import ReactECharts from 'echarts-for-react';

const COLORS = ['#1890ff', '#fa8c16', '#52c41a', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96'];

const CustomChartRenderer = ({ chart, chartData }) => {
  if (!chart || !chartData) return null;

  switch (chart.type) {
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={chart.xAxis} fontSize={11} />
            <YAxis fontSize={11} />
            <RechartsTooltip cursor={{ fill: '#e6f7ff' }} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey={chart.yAxis} fill="#1890ff" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    case 'line':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={chart.xAxis} fontSize={11} />
            <YAxis fontSize={11} />
            <RechartsTooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey={chart.yAxis} stroke="#1890ff" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      );
    case 'pie':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={chartData} 
              cx="50%" cy="50%" 
              outerRadius={60} 
              fill="#1890ff" 
              dataKey={chart.yAxis} 
              nameKey={chart.xAxis} 
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
              style={{ fontSize: 10 }}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      );
    case 'gauge':
      const lastVal = chartData.length > 0 ? Number(chartData[chartData.length - 1][chart.yAxis]) : 0;
      const gaugeOption = {
        series: [{
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
          data: [{ value: lastVal }]
        }]
      };
      return <ReactECharts option={gaugeOption} style={{ height: '100%', width: '100%' }} />;
    case 'bubble':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={chart.xAxis} name={chart.xAxis} fontSize={11} />
            <YAxis dataKey={chart.yAxis} name={chart.yAxis} fontSize={11} />
            <ZAxis dataKey={chart.yAxis} range={[50, 400]} />
            <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            <Scatter name={chart.title} data={chartData} fill="#1890ff" />
          </ScatterChart>
        </ResponsiveContainer>
      );
    default:
      return <div>Loại biểu đồ không hỗ trợ / Unsupported chart type</div>;
  }
};

export default CustomChartRenderer;
