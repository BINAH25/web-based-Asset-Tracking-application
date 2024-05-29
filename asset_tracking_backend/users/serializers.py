from django.contrib.auth import get_user_model
from rest_framework import serializers
from users.models import *
User = get_user_model()


class AddInstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields ='__all__'