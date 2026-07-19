import os

pages = ['App.tsx', 'AboutPage.tsx', 'UpdatesPage.tsx', 'PlacementsPage.tsx', 'CampusPage.tsx']
for page in pages:
    path = page
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        if lines and lines[0].strip() == '// @ts-nocheck':
            lines = lines[1:]
        with open(path, 'w', encoding='utf-8') as f:
            f.writelines(lines)

# Fix api.ts
with open('api.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';", "const API_BASE_URL = import.meta.env.VITE_API_URL;")

with open('api.ts', 'w', encoding='utf-8') as f:
    f.write(content)
