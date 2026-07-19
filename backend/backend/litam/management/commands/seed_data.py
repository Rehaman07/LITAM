import os
import django
from django.core.management.base import BaseCommand
from litam.models import Course, Placement, News, Event, Testimonial

class Command(BaseCommand):
    help = 'Seed database with initial data for LITAM'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')
        
        # Courses
        if not Course.objects.exists():
            Course.objects.create(
                title='B.Tech in Computer Science',
                category='BTECH',
                code='CS01',
                duration='4 Years',
                description='Learn software engineering, algorithms, and AI.',
                fee=150000.00,
                eligibility='10+2 with PCM'
            )
            Course.objects.create(
                title='Diploma in Mechanical',
                category='DIPLOMA',
                code='ME01',
                duration='3 Years',
                description='Core mechanics and manufacturing.',
                fee=50000.00,
                eligibility='10th Standard'
            )
            self.stdout.write(self.style.SUCCESS('Seeded Courses'))

        # Placements
        if not Placement.objects.exists():
            Placement.objects.create(
                highest_package='44 LPA',
                average_package='8 LPA',
                year=2025,
                recruiters=120,
                training_hours=500
            )
            self.stdout.write(self.style.SUCCESS('Seeded Placements'))

        # News
        if not News.objects.exists():
            News.objects.create(
                date='2025-01-10',
                title='LITAM Partners with Google',
                content='LITAM announces a new partnership to bring cloud training to students.',
                tag='Partnership'
            )
            self.stdout.write(self.style.SUCCESS('Seeded News'))

        # Testimonials
        if not Testimonial.objects.exists():
            Testimonial.objects.create(
                quote='The placement training was exceptional!',
                student_name='Alice Smith',
                metadata='Placed at Amazon, 25 LPA'
            )
            self.stdout.write(self.style.SUCCESS('Seeded Testimonials'))
            
        self.stdout.write(self.style.SUCCESS('Seeding complete!'))
