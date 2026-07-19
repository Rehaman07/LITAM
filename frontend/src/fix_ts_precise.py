import os, re

def fix_app():
    with open('App.tsx', 'r', encoding='utf-8') as f:
        c = f.read()

    # UploadResults import
    if 'UploadResults' not in c:
        c = c.replace('import SiteFooter from "./SiteFooter";', 'import SiteFooter from "./SiteFooter";\nimport UploadResults from "./components/Results/UploadResults";')

    # Remove unused React import if present and unused (or just replace it to fix error)
    c = c.replace("import React, { useState", "import { useState")
    
    # Fix unused vars (just prepend with underscore or remove)
    c = c.replace('const bgX', '// const bgX')
    c = c.replace('const bgY', '// const bgY')
    c = c.replace('const campusItems =', '// const campusItems =')
    c = c.replace('const news =', '// const news =')
    c = c.replace('const events =', '// const events =')
    c = c.replace('const FacultyAndResearch =', '// const FacultyAndResearch =')
    c = c.replace('const StudentLifeSection =', '// const StudentLifeSection =')
    
    # fix implicit any in parameters
    c = re.sub(r'\(label\)', r'(label: string)', c)
    c = re.sub(r'\(event\)', r'(event: any)', c)
    c = re.sub(r'\(className\)', r'(className: string)', c)
    c = re.sub(r'\(data\)', r'(data: any)', c)
    c = re.sub(r'\(content, key\)', r'(content: any, key: any)', c)
    c = re.sub(r'\(course, index\)', r'(course: any, index: any)', c)
    
    # Fix useState(null) assigning numbers
    c = c.replace('useState<any>(null)', 'useState<any>(0)')

    # Fix indexing with strings by using as keyof typeof
    c = c.replace('coursesData[activeCourse]', 'coursesData[activeCourse as keyof typeof coursesData]')
    
    # Fix forms 'e' and 'prev' implicit any
    c = re.sub(r'\((prev)\) =>', r'(prev: any) =>', c)

    # Fix e typing for missing ones
    c = re.sub(r'\(\s*e\s*\)\s*=>', r'(e: any) =>', c)

    with open('App.tsx', 'w', encoding='utf-8') as f:
        f.write(c)


def fix_pages():
    for page in ['AboutPage.tsx', 'CampusPage.tsx', 'PlacementsPage.tsx', 'UpdatesPage.tsx']:
        if not os.path.exists(page): continue
        with open(page, 'r', encoding='utf-8') as f:
            c = f.read()

        c = c.replace("import React, {", "import {")
        c = c.replace("import React from", "// import React from")
        
        c = re.sub(r'\((content, sectionName)\)', r'(content: any, sectionName: any)', c)
        c = re.sub(r'\((data)\)', r'(data: any)', c)
        
        # useState(null) -> 0
        c = c.replace('useState<any>(null)', 'useState<any>(0)')

        with open(page, 'w', encoding='utf-8') as f:
            f.write(c)

fix_app()
fix_pages()
