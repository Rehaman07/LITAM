from rest_framework import viewsets, status, parsers
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import HttpResponse
from .models import ResultBatch, StudentResult
from .serializers import ResultBatchSerializer, StudentResultSerializer
from .tasks import process_pdf_upload
from .services.pdf_generator import generate_student_pdf

class ResultBatchViewSet(viewsets.ModelViewSet):
    queryset = ResultBatch.objects.all().order_by('-uploaded_at')
    serializer_class = ResultBatchSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def perform_create(self, serializer):
        batch = serializer.save()
        process_pdf_upload.delay(batch.id)

class StudentResultViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StudentResult.objects.all()
    serializer_class = StudentResultSerializer
    lookup_field = 'hall_ticket_number'

    @action(detail=True, methods=['get'])
    def download_pdf(self, request, hall_ticket_number=None):
        try:
            student_result = self.get_object()
            pdf_buffer = generate_student_pdf(student_result)
            response = HttpResponse(pdf_buffer.read(), content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="result_{hall_ticket_number}.pdf"'
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
