import re

with open('src/pages/ExcelUpload.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

def replace_input_number(match):
    full_match = match.group(0)
    m2 = re.search(r"onChange=\{e => handleArrayChange\(([^,]+),\s*i,\s*([^,]+),\s*e\)\}", full_match)
    if m2:
        arr_field = m2.group(1)
        obj_field = m2.group(2)
        new_onchange = f'onChange={{e => handleArrayChange({arr_field}, i, {obj_field}, isNaN(e.target.value) ? 0 : Number(e.target.value))}}'
        replaced = re.sub(r'onChange=\{e => handleArrayChange\([^}]+\)\}', new_onchange, full_match)
        replaced = replaced.replace('<InputNumber', '<Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }}')
        return replaced
    m3 = re.search(r'onChange=\{v => handleConfigChange\(([^,]+),\s*v\)\}', full_match)
    if m3:
        key_name = m3.group(1)
        new_onchange = f'onChange={{e => handleConfigChange({key_name}, isNaN(e.target.value) ? 0 : Number(e.target.value))}}'
        replaced = re.sub(r'onChange=\{v => handleConfigChange\([^}]+\)\}', new_onchange, full_match)
        replaced = replaced.replace('<InputNumber', '<Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }}')
        return replaced
    return full_match

# Using DOTALL so .*? matches newlines as well
content = re.sub(r'<InputNumber.*?\/>', replace_input_number, content, flags=re.DOTALL)

with open('src/pages/ExcelUpload.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('InputNumber replacement complete.')
