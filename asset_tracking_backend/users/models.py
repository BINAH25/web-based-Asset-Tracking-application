from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

INSTITITION_TYPES = [
    ('Tertiary', 'Tertiary'),
    ('Secondary', 'Secondary'),
    ('Basic', 'Basic'),
]

class Institution(models.Model):
    username = models.CharField(max_length=254, unique=True)
    email = models.EmailField(max_length=200, unique=True, blank=True, null=True)
    institution_name = models.CharField(max_length=254)
    location = models.CharField(max_length=254, blank=True, null=True)
    phone = models.CharField(max_length=20, null=True,
                             blank=True, db_index=True)
    institution_type = models.CharField(
        max_length=50,
        choices=INSTITITION_TYPES)
    status = models.CharField(max_length=100, blank=True, null=True, default="New")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.institution_name) + " " + str(self.id)
    
class User(AbstractUser):
    institution =  models.ForeignKey(Institution, on_delete=models.CASCADE, null=True, blank=True)
    created_by = models.ForeignKey(
        "User", related_name="created_users", on_delete=models.SET_NULL, null=True, blank=True)
    otp = models.CharField(max_length=6, null=True, blank=True)
    otp_expiration = models.DateTimeField(null=True, blank=True)
    changed_password = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    
class ActivityLog(models.Model):
    username = models.CharField(max_length=100)
    action = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    duration_in_mills = models.IntegerField(default=0)

    def __str__(self) -> str:
        return "%s %s [%sms]" % (self.username, self.action, self.duration_in_mills)
