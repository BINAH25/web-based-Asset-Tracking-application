# Generated by Django 4.2.10 on 2024-05-29 09:09

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="SetupPerm",
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
            ],
            options={
                "permissions": [
                    ("view_institution", "Can view institution"),
                    ("add_institution", "Can add institution"),
                    ("edit_institution", "Can edit institution"),
                    ("delete_institution", "Can delete institution"),
                    ("view_user", "Can view user"),
                    ("add_user", "Can add user"),
                    ("edit_user", "Can edit user"),
                    ("delete_user", "Can delete user"),
                ],
                "managed": False,
                "default_permissions": (),
            },
        ),
    ]
