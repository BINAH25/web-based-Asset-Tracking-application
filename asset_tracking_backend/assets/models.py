from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()

# Create your models here.
class Tag(models.Model):
    tag_id = models.CharField(max_length=100, unique=True)
    tag_name = models.CharField(max_length=200, unique=True)
    created_by =  models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.tag_name


class Product(models.Model):
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)
    serial_number = models.CharField(max_length=100, unique=True)
    product_name = models.CharField(max_length=100)
    availability = models.CharField(max_length=100, default="Available")
    created_by =  models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    procurement_date = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.product_name + " " + str(self.tag)
    
    
    
class Asset(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="assets")
    owner = models.ForeignKey(User, on_delete=models.CASCADE,related_name="owner")
    created_by =  models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=100, default="Functional")
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return str(self.product )+ " - " + str(self.owner)
    
class AssetLog(models.Model):
    asset = models.ForeignKey(Asset, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    asset_name = models.CharField(max_length=255, null=True, blank=True)
    asset_serial_number = models.CharField(max_length=100, null=True, blank=True)
    asset_owner = models.CharField(max_length=200, null=True, blank=True)
    action = models.CharField(max_length=250)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.action


