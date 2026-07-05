from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("updates", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="ContactInquiry",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=150)),
                ("email", models.EmailField(blank=True, max_length=254)),
                ("phone", models.CharField(max_length=20)),
                ("course", models.CharField(max_length=50)),
                ("message", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
    ]
