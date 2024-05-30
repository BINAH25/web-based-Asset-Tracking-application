from django.contrib import admin
from assets.models import *
# Register your models here.
admin.site.register(Tag)
admin.site.register(Product)
admin.site.register(Asset)
admin.site.register(AssetLog)