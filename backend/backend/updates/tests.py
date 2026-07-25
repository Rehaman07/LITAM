from decimal import Decimal

from rest_framework import status
from rest_framework.test import APITestCase

from .models import ContentSection, StudentPlacement, Update


class SiteContentAPITests(APITestCase):
    def test_content_returns_all_section_keys(self):
        response = self.client.get("/api/updates/content/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        for section, _ in ContentSection.choices:
            self.assertIn(section, response.data)
            self.assertIsInstance(response.data[section], list)

    def test_content_includes_created_updates(self):
        Update.objects.create(
            section=ContentSection.NOTICE,
            title="Admissions Open",
            message="Apply before July 31.",
        )

        response = self.client.get("/api/updates/content/")
        notices = response.data["notice"]

        self.assertEqual(len(notices), 1)
        self.assertEqual(notices[0]["title"], "Admissions Open")


class StudentPlacementAPITests(APITestCase):
    def setUp(self):
        for index in range(5):
            StudentPlacement.objects.create(
                student_name=f"Student {index}",
                company_name=f"Company {index}",
                package_lpa=Decimal(f"{10 + index}.00"),
            )

    def test_student_placements_top_query_param(self):
        response = self.client.get("/api/updates/student-placements/", {"top": 3})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)

    def test_student_placements_ordered_by_package(self):
        response = self.client.get("/api/updates/student-placements/")
        packages = [item["package_lpa"] for item in response.data]
        self.assertEqual(packages, sorted(packages, reverse=True))


class ContactInquiryAPITests(APITestCase):
    def test_create_contact_inquiry(self):
        payload = {
            "name": "Jane Doe",
            "email": "jane@example.com",
            "phone": "9876543210",
            "course": "B.Tech CSE",
            "message": "Need admission details.",
        }

        response = self.client.post("/api/updates/contact-inquiries/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "Jane Doe")

    def test_contact_inquiry_requires_name_and_phone(self):
        response = self.client.post(
            "/api/updates/contact-inquiries/",
            {"course": "B.Tech CSE"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.data)
        self.assertIn("phone", response.data)
