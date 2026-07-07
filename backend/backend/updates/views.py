from collections import defaultdict
from rest_framework import generics, views, response
from .models import ContactInquiry, Update, ContentSection
from .serializers import ContactInquirySerializer, UpdateSerializer

class UpdateListAPIView(generics.ListAPIView):
    queryset = Update.objects.all()
    serializer_class = UpdateSerializer


class ContactInquiryCreateAPIView(generics.CreateAPIView):
    queryset = ContactInquiry.objects.all()
    serializer_class = ContactInquirySerializer


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
        return response.Response(payload)
