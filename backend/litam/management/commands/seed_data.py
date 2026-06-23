from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime
from litam.models import Course, Recruiter, PlacementHighlight, NewsAnnouncement, Event, Testimonial

class Command(BaseCommand):
    help = "Seeds initial database records for LITAM"

    def handle(self, *args, **options):
        self.stdout.write("Seeding data...")

        # 1. Courses
        courses_data = [
            # B.Tech
            {"name": "Computer Science and Engineering", "category": "btech", "counselling_code": "LOYL", "duration": "4 Years", "eligibility": "Intermediate (10+2) with MPC or equivalent diploma. AP EAPCET / ECET qualifier.", "description": "Deep dive into software engineering, advanced algorithms, full-stack systems, and distributed databases."},
            {"name": "CSE - Artificial Intelligence & Machine Learning", "category": "btech", "counselling_code": "LOYL", "duration": "4 Years", "eligibility": "Intermediate (10+2) with MPC. AP EAPCET / ECET qualifier.", "description": "Specialized study in neural networks, deep learning, computer vision, natural language processing, and smart systems."},
            {"name": "CSE - Data Science", "category": "btech", "counselling_code": "LOYL", "duration": "4 Years", "eligibility": "Intermediate (10+2) with MPC. AP EAPCET / ECET qualifier.", "description": "Focuses on big data analytics, statistical modeling, data visualization, and predictive machine learning models."},
            {"name": "Electronics and Communication Engineering", "category": "btech", "counselling_code": "LOYL", "duration": "4 Years", "eligibility": "Intermediate (10+2) with MPC. AP EAPCET / ECET qualifier.", "description": "Core curriculum in VLSI design, signal processing, embedded systems, Internet of Things, and telecommunications."},
            {"name": "Electrical and Electronics Engineering", "category": "btech", "counselling_code": "LOYL", "duration": "4 Years", "eligibility": "Intermediate (10+2) with MPC. AP EAPCET / ECET qualifier.", "description": "Study of power systems, power electronics, industrial control machines, automation, and green energy systems."},
            {"name": "Civil Engineering", "category": "btech", "counselling_code": "LOYL", "duration": "4 Years", "eligibility": "Intermediate (10+2) with MPC. AP EAPCET / ECET qualifier.", "description": "Covers structural design, geotech analysis, eco-friendly infrastructure, and construction management."},
            {"name": "Mechanical Engineering", "category": "btech", "counselling_code": "LOYL", "duration": "4 Years", "eligibility": "Intermediate (10+2) with MPC. AP EAPCET / ECET qualifier.", "description": "Hands-on study of robotics, manufacturing science, thermodynamics, CAD/CAM design, and structural automation."},
            { "name": "Artificial Intelligence & Data Science", "category": "btech", "counselling_code": "LOYL", "duration": "4 Years", "eligibility": "Intermediate (10+2) with MPC or equivalent diploma. AP EAPCET / ECET qualifier.", "description": "Comprehensive study of artificial intelligence, machine learning, deep learning, data analytics, big data technologies, computer vision, natural language processing, and intelligent decision-making systems."},
            # M.Tech
            {"name": "Structural Engineering", "category": "mtech", "counselling_code": "LOYL", "duration": "2 Years", "eligibility": "B.E./B.Tech in Civil Engineering with qualifying score in AP PGECET / GATE.", "description": "Post-graduate advanced study of complex structural analytics, concrete technologies, and earthquake-resistant designs."},
            
            # Diploma
            {"name": "Computer Science and Engineering (Diploma)", "category": "diploma", "counselling_code": "LITM", "duration": "3 Years", "eligibility": "SSC (10th Class) pass with Mathematics. AP POLYCET rank-holder.", "description": "Core technical training in programming languages, databases, web development basics, and hardware labs."},
            {"name": "CSE - AI & ML (Diploma)", "category": "diploma", "counselling_code": "LITM", "duration": "3 Years", "eligibility": "SSC (10th Class) pass. AP POLYCET rank-holder.", "description": "Introductory curriculum in Python, basic AI tools, machine learning pipelines, and technical problem solving."},
            {"name": "ECE (Diploma)", "category": "diploma", "counselling_code": "LITM", "duration": "3 Years", "eligibility": "SSC (10th Class) pass. AP POLYCET rank-holder.", "description": "Practical curriculum focused on circuit building, microcontrollers, IoT testing, and radio communications."},
            {"name": "EEE (Diploma)", "category": "diploma", "counselling_code": "LITM", "duration": "3 Years", "eligibility": "SSC (10th Class) pass. AP POLYCET rank-holder.", "description": "Hands-on polytechnic labs in wiring systems, electrical machines, power transmission systems, and safety procedures."},
            { "name": "Diploma in Artificial Intelligence & Data Science", "category": "diploma", "counselling_code": "LOYL", "duration": "3 Years", "eligibility": "SSC (10th Class) or equivalent. AP POLYCET qualifier.", "description": "Industry-oriented diploma program introducing students to Python programming, Artificial Intelligence, Machine Learning, Data Analytics, databases, and modern intelligent technologies with hands-on learning."}
            # PostGrad
            {"name": "MBA", "category": "postgrad", "counselling_code": "LITM", "duration": "2 Years", "eligibility": "Any recognized Bachelor's degree (3-year minimum) with 50% aggregate marks. AP ICET rank-holder.", "description": "Comprehensive management training specializing in Marketing, Finance, HR Management, and Operations."},
            {"name": "MCA", "category": "postgrad", "counselling_code": "LITM", "duration": "2 Years", "eligibility": "Recognized Bachelor's degree with Mathematics at 10+2 or Graduation. AP ICET rank-holder.", "description": "Advanced study of web engineering, database architecture, cloud structures, enterprise systems, and cyber security."}
        ]

        for course in courses_data:
            Course.objects.get_or_create(name=course["name"], defaults=course)

        # 2. Recruiters
        recruiters_data = [
            {"name": "Infosys", "mark": "I", "tone": "sky"},
            {"name": "TCS", "mark": "T", "tone": "violet"},
            {"name": "Wipro", "mark": "W", "tone": "rainbow"},
            {"name": "Accenture", "mark": ">", "tone": "purple"},
            {"name": "Cognizant", "mark": "C", "tone": "blue"},
            {"name": "Tech Mahindra", "mark": "TM", "tone": "red"},
            {"name": "Capgemini", "mark": "CA", "tone": "aqua"},
            {"name": "HCLTech", "mark": "H", "tone": "orange"},
        ]

        for recruiter in recruiters_data:
            Recruiter.objects.get_or_create(name=recruiter["name"], defaults=recruiter)

        # 3. Placement Highlights
        PlacementHighlight.objects.get_or_create(
            year=2026,
            defaults={"highest_package": "12 LPA", "training_hours": 300, "placements_count": 220}
        )

        # 4. News
        news_data = [
            {"title": "Admissions counselling support now open for AP EAPCET, ECET, PGECET, ICET, and POLYCET candidates.", "tag": "Admissions", "content": "Helpdesk is open on campus for students and parent queries regarding counselling codes and document readiness."},
            {"title": "LITAM celebrates NAAC 'A' grade accreditation renewal and expands state-of-the-art laboratory facilities.", "tag": "Institution", "content": "NAAC committee high praise for faculty metrics, modern labs, and infrastructure improvements."},
            {"title": "Technical Hackathon & cultural fest dates announced; student clubs commence project development.", "tag": "Campus", "content": "National level hack sprint scheduled next month. Register today through web desk."},
            {"title": "Placement cell signs new training and placement partnerships with leading MNCs for 2026 graduates.", "tag": "Academic", "content": "Industry readiness tracks loaded with aptitude mocks and resume design guides."}
        ]

        for item in news_data:
            NewsAnnouncement.objects.get_or_create(title=item["title"], defaults=item)

        # 5. Events
        events_data = [
            {"title": "Freshers orientation and parent interaction", "venue": "Main Auditorium", "date": datetime(2026, 6, 21, 10, 0)},
            {"title": "Hack LITAM: 24-hour product development sprint", "venue": "Innovation Hub", "date": datetime(2026, 6, 28, 9, 0)},
            {"title": "Career readiness & resume building bootcamp", "venue": "Placement Cell", "date": datetime(2026, 7, 5, 11, 0)},
        ]

        for ev in events_data:
            dt = timezone.make_aware(ev["date"])
            Event.objects.get_or_create(
                title=ev["title"],
                defaults={"venue": ev["venue"], "event_date": dt, "description": "Mock event details"}
            )

        # 6. Testimonials
        testimonials_data = [
            {"student_name": "Akhila R.", "metadata": "CSE Graduate (Placed at TCS)", "quote": "LITAM gave me the space to build, present, fail fast, and grow. The personal training from the placement cell was instrumental in helping me clear technical interviews with confidence."},
            {"student_name": "Naveen K.", "metadata": "ECE Graduate (Placed at Capgemini)", "quote": "The academic rigor combined with hands-on lab experiments helped me understand core electronics topics. Faculty mentors guided me to build working prototypes for national competitions."},
            {"student_name": "Meghana S.", "metadata": "AI & DS Graduate (Placed at Accenture)", "quote": "Student life at LITAM is extremely vibrant. Being part of the Innovation Club helped me develop leadership and collaboration skills that are invaluable in my current software development role."}
        ]

        for test in testimonials_data:
            Testimonial.objects.get_or_create(student_name=test["student_name"], defaults=test)

        self.stdout.write(self.style.SUCCESS("Database seeding completed!"))
