from django.apps import AppConfig

class LitamConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "litam"

    def ready(self):
        import litam.signals
