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
            # product
            ("view_product", "Can view product"),
            ("add_product", "Can add product"),
            ("edit_product", "Can edit product"),
            ("delete_product", "Can delete product"),
            # asset
            ("view_all_assets", "Can view asset"),
            ("add_asset", "Can add asset"),
            ("edit_asset", "Can edit asset"),
            ("delete_asset", "Can delete asset"),
        ]