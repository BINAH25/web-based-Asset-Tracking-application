# Generated by Django 4.2.10 on 2024-06-16 10:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("setup", "0004_alter_setupperm_options"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="setupperm",
            options={
                "default_permissions": (),
                "managed": False,
                "permissions": [
                    ("view_institution", "Can view institution"),
                    ("add_institution", "Can add institution"),
                    ("edit_institution", "Can edit institution"),
                    ("delete_institution", "Can delete institution"),
                    ("view_user", "Can view user"),
                    ("add_user", "Can add user"),
                    ("edit_user", "Can edit user"),
                    ("delete_user", "Can delete user"),
                    ("view_tag", "Can view tag"),
                    ("add_tag", "Can add tag"),
                    ("edit_tag", "Can edit tag"),
                    ("delete_tag", "Can delete tag"),
                    ("manage_product", "Can manage products"),
                    ("view_dashboard", "Can view dashboard"),
                    ("view_activity_log", "Can view activity log"),
                    ("view_all_assets", "Can view asset"),
                    ("add_asset", "Can add asset"),
                    ("edit_asset", "Can edit asset"),
                    ("delete_asset", "Can delete asset"),
                ],
            },
        ),
    ]