import React from 'react';
import { SHEET_COLUMNS } from '../config/dashboardConfig';

const CustomTooltip = ({ active, payload, label, sheetKey }) => {
  if (active && payload && payload.length) {
    const dataRow = payload[0].payload; // The underlying data row for this point
    const note = dataRow.note;

    return (
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #d9d9d9', padding: '10px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>
          {label}
        </p>
        
        {payload.map((entry, index) => {
          // Attempt to find metadata for this specific metric
          const colMeta = sheetKey && SHEET_COLUMNS[sheetKey] 
            ? SHEET_COLUMNS[sheetKey].find(c => c.key === entry.name || c.label === entry.name)
            : null;
            
          const displayName = colMeta ? colMeta.label : entry.name;
          
          // Determine if there's a unit for this metric
          let unit = '';
          if (colMeta && colMeta.unitKey && dataRow[colMeta.unitKey]) {
            unit = ` ${dataRow[colMeta.unitKey]}`;
          } else if (entry.unit) {
             unit = entry.unit; // Fallback if passed directly to recharts
          }

          // Format value (add commas if it's a number)
          const displayValue = typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value;

          return (
            <div key={index} style={{ color: entry.color, display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
              <span style={{ marginRight: '16px' }}>{displayName}:</span>
              <span style={{ fontWeight: 'bold' }}>{displayValue}{unit}</span>
            </div>
          );
        })}

        {note && (
          <div style={{ marginTop: '8px', paddingTop: '4px', borderTop: '1px dashed #d9d9d9', fontSize: '11px', color: '#888', maxWidth: '200px', whiteSpace: 'pre-wrap' }}>
            <span style={{ fontWeight: 'bold' }}>Ghi chú: </span>{note}
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
