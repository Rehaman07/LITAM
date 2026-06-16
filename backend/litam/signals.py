from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from .models import Course, Recruiter, PlacementHighlight, NewsAnnouncement, Event, Testimonial

@receiver([post_save, post_delete], sender=Course)
def invalidate_course_cache(sender, **kwargs):
    cache.delete("litam_courses")

@receiver([post_save, post_delete], sender=Recruiter)
def invalidate_recruiter_cache(sender, **kwargs):
    cache.delete("litam_recruiters")

@receiver([post_save, post_delete], sender=PlacementHighlight)
def invalidate_placement_cache(sender, **kwargs):
    cache.delete("litam_placements")

@receiver([post_save, post_delete], sender=NewsAnnouncement)
def invalidate_news_cache(sender, **kwargs):
    cache.delete("litam_news")

@receiver([post_save, post_delete], sender=Event)
def invalidate_event_cache(sender, **kwargs):
    cache.delete("litam_events")

@receiver([post_save, post_delete], sender=Testimonial)
def invalidate_testimonial_cache(sender, **kwargs):
    cache.delete("litam_testimonials")
