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
        
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=254)
    password = serializers.CharField(max_length=254)


class UserLoginSerializer(serializers.ModelSerializer):
    institution = AddInstitutionSerializer()
    class Meta:
        model = User
        fields = [
            'email',
            'username',
            'is_superuser',
            'is_staff',
            'institution'
        ]
        
        
    