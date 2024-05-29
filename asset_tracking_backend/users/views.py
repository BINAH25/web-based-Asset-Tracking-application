from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework import generics, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from users.models import *
from users.serializers import *
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.mail import send_mail, EmailMultiAlternatives
#from rest_api.permissions import APILevelPermissionCheck
from django.shortcuts import HttpResponse
from django.db.models import Q
from django.conf import settings
User = get_user_model()
# Create your views here.


class AddInstitutinAPI(generics.GenericAPIView):
    """ check for require permission for adding a institution """
    # permission_classes = [permissions.IsAuthenticated,APILevelPermissionCheck]
    # required_permissions = [ "setup.add_file"]
    permission_classes = [permissions.AllowAny]

    serializer_class = AddInstitutionSerializer
    def post(self, request,*args, **kwargs):
        """ for adding  institution"""
        serializers = self.serializer_class(data=request.data)
        if serializers.is_valid():
            serializers.save()
            return Response(
                    {
                        "status": "success",
                        "detail": "Institution added Successfully",
                    },
                    status=status.HTTP_201_CREATED,
                )
        else:
            return Response(
                {"status": "failure", "detail": serializers.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )