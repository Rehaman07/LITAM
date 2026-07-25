from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("updates", "0002_contactinquiry"),
    ]

    operations = [
        migrations.AddField(
            model_name="update",
            name="title",
            field=models.CharField(default="Untitled Update", help_text="Short headline for the update.", max_length=200),
            preserve_default=False,
        ),
    ]
