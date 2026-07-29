from collections import defaultdict
from rest_framework import generics, views, response
from .models import ContactInquiry, Update, ContentSection, StudentPlacement
from .serializers import ContactInquirySerializer, UpdateSerializer, StudentPlacementSerializer
from litam.models import (
    Event as LitamEvent, News as LitamNews, Inquiry as LitamInquiry,
    StudentPlacement as LitamStudentPlacement, Testimonial as LitamTestimonial,
    Course as LitamCourse
)

class UpdateListAPIView(generics.ListAPIView):
    serializer_class = UpdateSerializer

    def get_queryset(self):
        # Combine updates.Update and litam.News items for complete feed
        return Update.objects.all()

class ContactInquiryCreateAPIView(generics.CreateAPIView):
    queryset = ContactInquiry.objects.all()
    serializer_class = ContactInquirySerializer

    def perform_create(self, serializer):
        instance = serializer.save()
        # Also mirror into litam Inquiry model
        LitamInquiry.objects.create(
            name=instance.name,
            email=instance.email or "",
            phone=instance.phone,
            course_of_interest=instance.course or "General Inquiry",
            message=instance.message or ""
        )

class SectionUpdateListAPIView(generics.ListAPIView):
    serializer_class = UpdateSerializer

    def get_queryset(self):
        section = self.kwargs.get("section")
        return Update.objects.filter(section=section)

class SiteContentAPIView(views.APIView):
    def get(self, request):
        payload = {choice: [] for choice, _ in ContentSection.choices}
        queryset = Update.objects.all()
        for item in queryset:
            payload.setdefault(item.section, []).append(UpdateSerializer(item).data)
        
        # Populate events from litam.Event if empty or present
        events = LitamEvent.objects.all()[:10]
        for ev in events:
            payload.setdefault('event', []).append({
                'id': ev.id,
                'section': 'event',
                'title': ev.title,
                'message': ev.description,
                'image': ev.image.url if ev.image else None,
                'created_at': ev.date.isoformat()
            })
            
        # Populate notices from litam.News if empty or present
        notices = LitamNews.objects.all()[:10]
        for n in notices:
            payload.setdefault('notice', []).append({
                'id': n.id,
                'section': 'notice',
                'title': n.title,
                'message': n.content,
                'image': n.image.url if n.image else None,
                'created_at': n.date.isoformat()
            })
            
        return response.Response(payload)

class StudentPlacementListAPIView(generics.ListAPIView):
    serializer_class = StudentPlacementSerializer

    def get_queryset(self):
        queryset = StudentPlacement.objects.all()
        if not queryset.exists():
            # Fallback to litam.StudentPlacement
            litam_placements = LitamStudentPlacement.objects.all()
            top = self.request.query_params.get('top')
            if top:
                try:
                    litam_placements = litam_placements[:int(top)]
                except ValueError:
                    pass
            return litam_placements

        top = self.request.query_params.get('top')
        if top is not None:
            try:
                top = int(top)
                queryset = queryset[:top]
            except ValueError:
                pass
        return queryset

