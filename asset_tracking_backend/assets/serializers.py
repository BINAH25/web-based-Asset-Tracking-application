from django.contrib.auth import get_user_model
from rest_framework import serializers
from assets.models import *
from users.serializers import *
User = get_user_model()


class AddTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['tag_id','tag_name']
        
class GettAllTagSerializer(serializers.ModelSerializer):
    created_by = UserSerializer()
    class Meta:
        model = Tag
        fields = '__all__'
        
class DeleteTagSerializer(serializers.Serializer):
    tag_id = serializers.CharField(max_length=254)


