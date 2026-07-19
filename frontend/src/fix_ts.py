import sys

def fix_student_lookup():
    with open('components/Results/StudentLookup.tsx', 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace("import api from '../api';", "import api from '../../api';")
    content = content.replace("const Reveal = ({ children, delay = 0, className = '', style = {} }", "const Reveal = ({ children, delay = 0, className = '', style = {} }: any")
    content = content.replace("const [result, setResult] = useState(null);", "const [result, setResult] = useState<any>(null);")
    content = content.replace("const handleSearch = async (e) => {", "const handleSearch = async (e: any) => {")
    content = content.replace("} catch (err) {", "} catch (err: any) {")
    
    with open('components/Results/StudentLookup.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

def fix_upload_results():
    with open('components/Results/UploadResults.tsx', 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace("import api from '../api';", "import api from '../../api';")
    content = content.replace("const Reveal = ({ children, delay = 0, className = '', style = {} }", "const Reveal = ({ children, delay = 0, className = '', style = {} }: any")
    content = content.replace("const [file, setFile] = useState(null);", "const [file, setFile] = useState<any>(null);")
    content = content.replace("const [batches, setBatches] = useState([]);", "const [batches, setBatches] = useState<any[]>([]);")
    content = content.replace("const handleUpload = async (e) => {", "const handleUpload = async (e: any) => {")
    
    with open('components/Results/UploadResults.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

fix_student_lookup()
fix_upload_results()
