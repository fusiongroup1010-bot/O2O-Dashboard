import re

with open('src/pages/ExcelUpload.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

def replace_input_number(match):
    full_match = match.group(0)
    m2 = re.search(r'onChange=\{e => handleArrayChange\(([^,]+), i, ([^,]+), e\)\}', full_match)
    if m2:
        arr_field = m2.group(1)
        obj_field = m2.group(2)
        new_onchange = f'onChange={{e => handleArrayChange({arr_field}, i, {obj_field}, isNaN(e.target.value) ? 0 : Number(e.target.value))}}'
        replaced = re.sub(r'onChange=\{e => handleArrayChange\([^}]+\)\}', new_onchange, full_match)
        replaced = replaced.replace('<InputNumber', '<Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }}')
        return replaced
    m3 = re.search(r'onChange=\{v => handleConfigChange\(([^,]+), v\)\}', full_match)
    if m3:
        key_name = m3.group(1)
        new_onchange = f'onChange={{e => handleConfigChange({key_name}, isNaN(e.target.value) ? 0 : Number(e.target.value))}}'
        replaced = re.sub(r'onChange=\{v => handleConfigChange\([^}]+\)\}', new_onchange, full_match)
        replaced = replaced.replace('<InputNumber', '<Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }}')
        return replaced
    return full_match

content = re.sub(r'<InputNumber[^>]+>', replace_input_number, content)

tables = [
    ('onlineGmv', '03_Online_GMV'),
    ('onlineRoas', '04_Online_ROAS'),
    ('adsConversion', '05_Ads_Conversion'),
    ('inventorySku', '06_Inventory_SKU'),
    ('stockSafety', '07_Stock_Safety'),
    ('orderStatus', '08_Order_Status'),
    ('offlineTraffic', '09_Offline_Traffic'),
    ('qrFunnel', '10_QR_Funnel'),
    ('csResponse', '12_CS_Response'),
    ('alertsLog', '13_Alerts_Log')
]

for arr_field, tab_name in tables:
    content = re.sub(
        r'addRow\(\'' + arr_field + r'\', \{ (.*?)\}\)',
        r"addRow('" + arr_field + r"', { date: selectedDate, \1})",
        content
    )

panes = content.split('<Tabs.TabPane ')
for i in range(1, len(panes)):
    pane = panes[i]
    m = re.search(r'addRow\(\'([a-zA-Z0-9_]+)\',', pane)
    if m:
        arr_field = m.group(1)
        old_col = "<Table.Column title={getColTitle('Ngày', 'Date')} render={() => <Text>{selectedDate}</Text>} />"
        new_col = f"""<Table.Column 
                title={{getColTitle('Ngày', 'Date')}} 
                dataIndex="date" 
                width={{140}} 
                render={{(v, _, i) => (
                  <DatePicker 
                    value={{v ? dayjs(v, 'YYYY-MM-DD') : dayjs(selectedDate, 'YYYY-MM-DD')}} 
                    format="YYYY-MM-DD" 
                    onChange={{(date, dateStr) => handleArrayChange('{arr_field}', i, 'date', dateStr || selectedDate)}} 
                    style={{{{width: '100%'}}}} 
                  />
                )}} 
              />"""
        panes[i] = pane.replace(old_col, new_col)

content = '<Tabs.TabPane '.join(panes)

with open('src/pages/ExcelUpload.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Replacement complete.')
