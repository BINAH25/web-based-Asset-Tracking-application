from django.contrib.auth import get_user_model
from rest_framework import serializers
from users.models import *
User = get_user_model()


class AddInstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields ='__all__'
        
        
class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'institution',
            'password'
        ]
        extra_kwargs = {'password': {'write_only': True}}
        
    