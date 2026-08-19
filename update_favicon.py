import base64
import re

with open('public/title-logo.png', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('utf-8')

data_uri = f"data:image/png;base64,{b64}"

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = re.sub(r'<link rel="icon"[^>]+>', f'<link rel="icon" type="image/png" href="{data_uri}" />', html)
html = re.sub(r'<link rel="apple-touch-icon"[^>]+>', f'<link rel="apple-touch-icon" href="{data_uri}" />', html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
