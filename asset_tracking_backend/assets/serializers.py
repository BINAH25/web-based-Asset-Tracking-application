from django.contrib.auth import get_user_model
from rest_framework import serializers
from assets.models import *
User = get_user_model()


class AddTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['tag_id','tag_name']
