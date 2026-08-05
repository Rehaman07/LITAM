from decimal import Decimal
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase
from .models import User, Course, Event, Testimonial, StudentPlacement, Inquiry, News, CampusGallery, StudentGallery, Update

class LitamAPITests(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@litam.edu.in',
            password='password123',
            role=User.Role.ADMIN
        )
        self.course = Course.objects.create(
            title="B.Tech Computer Science & Engineering",
            category=Course.Category.BTECH,
            code="CSE101",
            duration="4 Years",
            description="Leading CSE program",
            fee=125000.00,
            is_featured=True
        )
        self.event = Event.objects.create(
            title="Tech Symposium 2026",
            description="Annual technical festival",
            venue="Main Auditorium",
            date=timezone.now() + timezone.timedelta(days=7),
            is_featured=True
        )
        self.testimonial = Testimonial.objects.create(
            student_name="Rahul Sharma",
            quote="Great campus and placements!",
            role_or_company="Software Engineer @ TCS",
            rating=5,
            is_active=True,
            order=1
        )
        self.placement = StudentPlacement.objects.create(
            student_name="Ananya Rao",
            company_name="Microsoft",
            package_lpa=Decimal("44.00"),
            branch="CSE",
            year=2026,
            is_featured=True
        )
        self.campus_gallery = CampusGallery.objects.create(
            title="High-Tech Digital Lab",
            category="Labs",
            description="State of the art computing lab",
            is_featured=True
        )
        self.student_gallery = StudentGallery.objects.create(
            title="Hackathon 2026 Winners",
            category="Events",
            description="24-hour coding marathon",
            is_featured=True
        )

    def test_fetch_courses(self):
        response = self.client.get("/api/litam/courses/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["code"], "CSE101")

    def test_fetch_campus_gallery(self):
        response = self.client.get("/api/litam/campus-gallery/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "High-Tech Digital Lab")

    def test_fetch_student_gallery(self):
        response = self.client.get("/api/litam/student-gallery/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Hackathon 2026 Winners")

    def test_submit_inquiry(self):
        payload = {
            "name": "Siddharth Verma",
            "email": "sid@example.com",
            "phone": "9876543210",
            "course": "B.Tech CSE",
            "message": "Is scholarship available?"
        }
        response = self.client.post("/api/litam/inquiries/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "Siddharth Verma")
        self.assertEqual(Inquiry.objects.filter(name="Siddharth Verma").count(), 1)

    def test_login_logout_flow(self):
        login_payload = {
            "username": "admin",
            "password": "password123"
        }
        response = self.client.post("/api/litam/auth/login/", login_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "admin")

        me_response = self.client.get("/api/litam/auth/me/")
        self.assertEqual(me_response.status_code, status.HTTP_200_OK)
        self.assertEqual(me_response.data["email"], "admin@litam.edu.in")

        logout_response = self.client.post("/api/litam/auth/logout/")
        self.assertEqual(logout_response.status_code, status.HTTP_200_OK)
