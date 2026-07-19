import os

def fix_app():
    with open('App.tsx', 'r', encoding='utf-8') as f:
        c = f.read()
    
    # Fix Reveal component
    c = c.replace('function Reveal({ children, delay = 0, className = "" }) {', 'function Reveal({ children, delay = 0, className = "", style = {} }: any) {')
    
    # Fix useState({})
    c = c.replace('useState({})', 'useState<any>({})')

    # Remove unused vars (comment them out)
    c = c.replace('const bgX =', '// const bgX =')
    c = c.replace('const bgY =', '// const bgY =')
    c = c.replace('const campusItems =', '// const campusItems =')
    c = c.replace('const news =', '// const news =')
    c = c.replace('const events =', '// const events =')
    c = c.replace('const FacultyAndResearch =', '// const FacultyAndResearch =')
    c = c.replace('const StudentLifeSection =', '// const StudentLifeSection =')

    # Remove unused React import
    c = c.replace('import React, { useEffect', 'import { useEffect')

    with open('App.tsx', 'w', encoding='utf-8') as f:
        f.write(c)

def fix_about():
    if not os.path.exists('AboutPage.tsx'): return
    with open('AboutPage.tsx', 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace('// import React from "react";', 'import React from "react";')
    with open('AboutPage.tsx', 'w', encoding='utf-8') as f:
        f.write(c)

def fix_pages():
    for page in ['PlacementsPage.tsx', 'UpdatesPage.tsx']:
        if not os.path.exists(page): continue
        with open(page, 'r', encoding='utf-8') as f:
            c = f.read()
        c = c.replace('import React from "react";', '// import React from "react";')
        with open(page, 'w', encoding='utf-8') as f:
            f.write(c)

fix_app()
fix_about()
fix_pages()
