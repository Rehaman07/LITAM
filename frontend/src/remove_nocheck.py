import os

def process():
    pages = ['App.tsx', 'UpdatesPage.tsx', 'PlacementsPage.tsx', 'CampusPage.tsx']
    for page in pages:
        if os.path.exists(page):
            with open(page, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            if lines and lines[0].strip() == '// @ts-nocheck':
                lines = lines[1:]
            with open(page, 'w', encoding='utf-8') as f:
                f.writelines(lines)

    # Fix App.tsx missing UploadResults
    with open('App.tsx', 'r', encoding='utf-8') as f:
        c = f.read()
    if 'UploadResults' not in c:
        c = c.replace('import SiteFooter from "./SiteFooter";', 'import SiteFooter from "./SiteFooter";\nimport UploadResults from "./components/Results/UploadResults";')
    with open('App.tsx', 'w', encoding='utf-8') as f:
        f.write(c)

    # Fix AboutPage.tsx React UMD error
    if os.path.exists('AboutPage.tsx'):
        with open('AboutPage.tsx', 'r', encoding='utf-8') as f:
            c = f.read()
        if '// import React from "react";' in c:
            c = c.replace('// import React from "react";', 'import React from "react";')
        elif 'import React from "react";' not in c:
            c = 'import React from "react";\n' + c
        with open('AboutPage.tsx', 'w', encoding='utf-8') as f:
            f.write(c)

    # Fix App React UMD
    with open('App.tsx', 'r', encoding='utf-8') as f:
        c = f.read()
    if 'import { useEffect' in c and 'import React' not in c:
        c = c.replace('import { useEffect', 'import React, { useEffect')
    with open('App.tsx', 'w', encoding='utf-8') as f:
        f.write(c)

process()
