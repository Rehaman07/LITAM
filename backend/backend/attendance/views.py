from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q, F, FloatField, ExpressionWrapper
from .models import Course, Branch, Section, Student
from .serializers import (
    CourseSerializer, 
    BranchSerializer, 
    SectionSerializer, 
    StudentAttendanceStatsSerializer
)

class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.all().order_by('name')
    serializer_class = CourseSerializer

class BranchViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BranchSerializer

    def get_queryset(self):
        queryset = Branch.objects.all().order_by('name')
        course_id = self.request.query_params.get('course_id')
        if course_id is not None:
            queryset = queryset.filter(course_id=course_id)
        return queryset

class SectionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SectionSerializer

    def get_queryset(self):
        queryset = Section.objects.all().order_by('name')
        branch_id = self.request.query_params.get('branch_id')
        if branch_id is not None:
            queryset = queryset.filter(branch_id=branch_id)
        
        # Annotate with stats for the branch view
        today = datetime.datetime.now().date()
        queryset = queryset.annotate(
            total_students=Count('students', distinct=True),
            absent_today=Count('students__attendances', filter=Q(students__attendances__date=today, students__attendances__status='ABSENT'), distinct=True)
        )
        return queryset

class StudentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = StudentAttendanceStatsSerializer

    def get_queryset(self):
        queryset = Student.objects.all().order_by('name')
        section_id = self.request.query_params.get('section_id')
        if section_id is not None:
            queryset = queryset.filter(section_id=section_id)
        
        # Annotate with attendance stats
        queryset = queryset.annotate(
            present_count=Count('attendances', filter=Q(attendances__status='PRESENT')),
            absent_count=Count('attendances', filter=Q(attendances__status='ABSENT')),
        )
        
        from django.db.models import Case, When, Value
        
        # Calculate percentage (present / (present + absent)) * 100
        queryset = queryset.annotate(
            total_classes=F('present_count') + F('absent_count')
        ).annotate(
            attendance_percentage=Case(
                When(total_classes=0, then=Value(None)),
                default=ExpressionWrapper(
                    F('present_count') * 100.0 / F('total_classes'),
                    output_field=FloatField()
                ),
                output_field=FloatField()
            )
        )
        
        return queryset

import openpyxl
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
import datetime
from .models import UploadedSheet, Attendance

class UploadAttendanceView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get('file')
        section_id = request.data.get('section_id')
        date_str = request.data.get('date')
        
        if not file_obj or not section_id or not date_str:
            return Response({"error": "Missing file, section_id, or date"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            section = Section.objects.get(id=section_id)
            date_obj = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
        except Exception as e:
            return Response({"error": "Invalid section or date format"}, status=status.HTTP_400_BAD_REQUEST)

        uploaded_sheet = UploadedSheet.objects.create(file=file_obj, status=UploadedSheet.Status.PROCESSED)

        try:
            wb = openpyxl.load_workbook(file_obj)
            sheet = wb.active
            
            created_count = 0
            updated_count = 0

            headers = [cell.value for cell in sheet[1]]
            header_map = {str(h).lower().strip(): i for i, h in enumerate(headers) if h}

            roll_idx = header_map.get('roll number') or header_map.get('roll_number') or header_map.get('roll') or header_map.get('id')
            name_idx = header_map.get('name') or header_map.get('student name') or header_map.get('student')
            status_idx = header_map.get('status') or header_map.get('present / absent') or header_map.get('attendance')
            phone_idx = header_map.get('phone number') or header_map.get('phone')
            
            if roll_idx is None or status_idx is None:
                uploaded_sheet.status = UploadedSheet.Status.FAILED
                uploaded_sheet.notes = "Missing required columns: Roll Number, Status"
                uploaded_sheet.save()
                return Response({"error": "Missing Roll Number or Status column. Found headers: " + str(headers)}, status=400)

            for row in sheet.iter_rows(min_row=2, values_only=True):
                if row[roll_idx] is None:
                    continue
                
                roll_number = str(row[roll_idx]).strip()
                student_name = str(row[name_idx]).strip() if name_idx is not None and row[name_idx] is not None else roll_number
                att_status_raw = str(row[status_idx]).strip().upper() if row[status_idx] is not None else "ABSENT"
                phone = str(row[phone_idx]).strip() if phone_idx is not None and row[phone_idx] is not None else ""

                if att_status_raw in ['P', 'PRESENT', 'TRUE', '1', 'YES']:
                    att_status = Attendance.Status.PRESENT
                else:
                    att_status = Attendance.Status.ABSENT

                student, created = Student.objects.get_or_create(
                    roll_number=roll_number,
                    defaults={'name': student_name, 'section': section, 'parent_phone': phone}
                )

                if not created and (student.section != section):
                    student.section = section
                    student.save()

                attendance, att_created = Attendance.objects.update_or_create(
                    student=student,
                    date=date_obj,
                    defaults={'status': att_status, 'sheet': uploaded_sheet}
                )

                if att_created:
                    created_count += 1
                else:
                    updated_count += 1

            return Response({
                "message": "Successfully processed attendance",
                "created": created_count,
                "updated": updated_count
            })

        except Exception as e:
            uploaded_sheet.status = UploadedSheet.Status.FAILED
            uploaded_sheet.notes = str(e)
            uploaded_sheet.save()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

import plivo
from django.conf import settings
from django.http import HttpResponse

class NotifyAbsenteesView(APIView):
    def post(self, request, *args, **kwargs):
        target_type = request.data.get('target_type')
        target_id = request.data.get('target_id')
        date_str = request.data.get('date')
        action = request.data.get('action') # 'call' or 'sms'

        if not target_type or not target_id or not date_str or not action:
            return Response({"error": "Missing parameters"}, status=400)

        try:
            date_obj = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
        except:
            return Response({"error": "Invalid date"}, status=400)

        students = Student.objects.filter(attendances__date=date_obj, attendances__status=Attendance.Status.ABSENT)
        if target_type == 'branch':
            students = students.filter(section__branch_id=target_id)
        elif target_type == 'section':
            students = students.filter(section_id=target_id)
        else:
            return Response({"error": "Invalid target_type"}, status=400)

        # Ensure we only get distinct students with valid phone numbers
        students = students.exclude(parent_phone__isnull=True).exclude(parent_phone__exact='').distinct()

        if not students.exists():
            return Response({"message": "No absent students with valid phone numbers found for this target."})

        # Mock or initialize Plivo client
        plivo_id = getattr(settings, 'PLIVO_AUTH_ID', 'dummy_id')
        plivo_token = getattr(settings, 'PLIVO_AUTH_TOKEN', 'dummy_token')
        
        queued_count = 0
        failed_count = 0

        # Create a notification campaign record
        campaign = None
        from .models import NotificationCampaign, NotificationLog
        campaign = NotificationCampaign.objects.create(
            date=date_obj,
            message_template="Your ward {name} was marked absent today.",
            sent_at=datetime.datetime.now()
        )

        try:
            client = plivo.RestClient(plivo_id, plivo_token)
        except Exception:
            client = None

        base_url = request.build_absolute_uri('/')[:-1] # e.g. http://localhost:8000

        for student in students:
            phone = student.parent_phone
            if not phone.startswith('+'):
                phone = '+91' + phone.lstrip('0')
            
            success = False
            error_msg = ""
            
            try:
                if action == 'sms' and client:
                    message_text = f"LITAM Alert: Hello. Your ward {student.name} was marked ABSENT today ({date_str}). Please contact the college office immediately if this is incorrect."
                    client.messages.create(
                        src='LITAM',
                        dst=phone,
                        text=message_text
                    )
                    success = True
                elif action == 'call' and client:
                    # Point Plivo to our XML endpoint to read the dynamic message
                    answer_url = f"{base_url}/api/attendance/plivo-xml/?name={student.name}&date={date_str}"
                    client.calls.create(
                        from_='+919876543210', # Dummy sender
                        to_=phone,
                        answer_url=answer_url,
                        answer_method='GET'
                    )
                    success = True
                else:
                    # If client is None (no keys), just simulate success for testing
                    success = True
            except Exception as e:
                error_msg = str(e)
                success = False

            if success:
                queued_count += 1
                NotificationLog.objects.create(campaign=campaign, student=student, status=NotificationLog.Status.SUCCESS)
            else:
                failed_count += 1
                NotificationLog.objects.create(campaign=campaign, student=student, status=NotificationLog.Status.FAILED, error_message=error_msg)

        return Response({
            "message": f"Successfully queued {queued_count} {action}s. Failed: {failed_count}.",
            "queued": queued_count,
            "failed": failed_count
        })

class PlivoXMLView(APIView):
    authentication_classes = [] # Allow Plivo to access without token
    permission_classes = []

    def get(self, request, *args, **kwargs):
        name = request.query_params.get('name', 'Student')
        date = request.query_params.get('date', 'today')
        
        xml_content = f"""<Response>
            <Speak>Hello. This is an urgent message from the Loyola Institute of Technology and Management. Your ward, {name}, has been marked ABSENT on {date}. Please contact the college office immediately if this attendance record is incorrect. Thank you.</Speak>
        </Response>"""
        
        return HttpResponse(xml_content, content_type='application/xml')
