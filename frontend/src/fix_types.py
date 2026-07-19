import os, re

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Generic any typings for parameters
    content = re.sub(r'function (\w+)\(\s*\{\s*(.*?)\s*\}\s*\)\s*\{', r'function \1({\2}: any) {', content)
    
    # State any typings
    content = content.replace('useState([])', 'useState<any[]>([])')
    content = content.replace('useState(null)', 'useState<any>(null)')
    content = content.replace('useState({})', 'useState<any>({})')
    content = content.replace('setContent({})', 'setContent({} as any)')

    # children, delay, className, style in Reveal
    content = content.replace("const Reveal = ({ children, delay = 0, className = '', style = {} }", "const Reveal = ({ children, delay = 0, className = '', style = {} }: any")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

pages = ['App.tsx', 'AboutPage.tsx', 'UpdatesPage.tsx', 'PlacementsPage.tsx', 'CampusPage.tsx']
for p in pages:
    if os.path.exists(p):
        fix_file(p)
