from django.urls import path
from .views import ContactInquiryCreateAPIView, SectionUpdateListAPIView, SiteContentAPIView, UpdateListAPIView

urlpatterns = [
    path('', UpdateListAPIView.as_view(), name='update-list'),
    path('contact-inquiries/', ContactInquiryCreateAPIView.as_view(), name='contact-inquiry-create'),
    path('content/', SiteContentAPIView.as_view(), name='site-content'),
    path('notices/', SectionUpdateListAPIView.as_view(), {'section': 'notice'}, name='notices'),
    path('events/', SectionUpdateListAPIView.as_view(), {'section': 'event'}, name='events'),
    path('gallery/', SectionUpdateListAPIView.as_view(), {'section': 'gallery'}, name='gallery'),
    path('placements/', SectionUpdateListAPIView.as_view(), {'section': 'placement'}, name='placements'),
    path('faculty/', SectionUpdateListAPIView.as_view(), {'section': 'faculty'}, name='faculty'),
    path('testimonials/', SectionUpdateListAPIView.as_view(), {'section': 'testimonial'}, name='testimonials'),
    path('courses/', SectionUpdateListAPIView.as_view(), {'section': 'course'}, name='courses'),
    path('recruiters/', SectionUpdateListAPIView.as_view(), {'section': 'recruiter'}, name='recruiters'),
]
