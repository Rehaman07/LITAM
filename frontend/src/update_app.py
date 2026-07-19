import sys

with open('App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace previous endpoints
content = content.replace("api.get('/courses/')", "api.get('/litam/courses/')")
content = content.replace('api.post("/updates/contact-inquiries/", formData)', 'api.post("/litam/inquiries/", formData)')

# Import Results components
imports = """import SiteFooter from "./SiteFooter";
import StudentLookup from "./components/Results/StudentLookup";
import UploadResults from "./components/Results/UploadResults";"""
content = content.replace('import SiteFooter from "./SiteFooter";', imports)

# Add StudentLookup
website_content_replacement = """      <AcademicsSection content={content} />
      <EligibilityEstimator />
      <StudentLookup />
      <Placements content={content} />"""
website_content_search = """      <AcademicsSection content={content} />
      <EligibilityEstimator />
      <Placements content={content} />"""
content = content.replace(website_content_search, website_content_replacement)

# Remove Faculty
faculty_search = """      <FacultyAndResearch content={content} />\n"""
content = content.replace(faculty_search, "")

# Add Admin route
route_replacement = """        <Route
          path="/admin/results"
          element={
            <motion.main
              className="site admin-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <UploadResults />
            </motion.main>
          }
        />
        <Route
          path="*" """
content = content.replace('        <Route\n          path="*"', route_replacement)

with open('App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
