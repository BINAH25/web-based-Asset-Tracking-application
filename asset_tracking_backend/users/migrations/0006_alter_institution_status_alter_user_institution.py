# Generated by Django 4.2.10 on 2024-06-06 10:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0005_institution_status"),
    ]

    operations = [
        migrations.AlterField(
            model_name="institution",
            name="status",
            field=models.CharField(
                blank=True, default="New", max_length=100, null=True
            ),
        ),
        migrations.AlterField(
            model_name="user",
            name="institution",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="users.institution",
            ),
        ),
    ]