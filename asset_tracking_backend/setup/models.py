from django.db import models

# Create your models here.

class SetupPerm(models.Model):

    class Meta:
        managed = False
        default_permissions = ()
        permissions = [
            # institution
            ("view_institution", "Can view institution"),
            ("add_institution", "Can add institution"),
            ("edit_institution", "Can edit institution"),
            ("delete_institution", "Can delete institution"),

            # user
            ("view_user", "Can view user"),
            ("add_user", "Can add user"),
            ("edit_user", "Can edit user"),
            ("delete_user", "Can delete user"),
            # tag
            ("view_tag", "Can view tag"),
            ("add_tag", "Can add tag"),
            ("edit_tag", "Can edit tag"),
            ("delete_tag", "Can delete tag"),
        ]