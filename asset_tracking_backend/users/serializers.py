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
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'username',
            'email'
        ]
        
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=254)
    password = serializers.CharField(max_length=254)


class UserLoginSerializer(serializers.ModelSerializer):
    institution = AddInstitutionSerializer()
    created_by = UserSerializer()
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'username',
            'is_superuser',
            'is_staff',
            'created_by',
            'institution',
            'changed_password'
        ]
        
class UserActivityLogSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = ActivityLog
        fields = '__all__'
        
class OTPVerifySerializer(serializers.Serializer):
    #username = serializers.CharField()
    otp = serializers.CharField(max_length=6)
    
class DeleteInstitutionSerializer(serializers.Serializer):
    institution_id = serializers.CharField(max_length=100)
    
class DeleteUserSerializer(serializers.Serializer):
    user_id = serializers.CharField(max_length=100)

