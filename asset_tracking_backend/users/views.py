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
from utils.permissions import APILevelPermissionCheck
from utils.user_permissions import get_all_user_permissions
from django.shortcuts import HttpResponse
from django.db.models import Q
from django.conf import settings
User = get_user_model()
# Create your views here.

def get_auth_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'user':UserLoginSerializer(user).data,
        'permission':get_all_user_permissions(user),
        'refresh': str(refresh),
        'token': str(refresh.access_token) 
    }

class SignInAPI(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer
    def post(self, request,*args, **kwargs):
        serializers = self.serializer_class(data=request.data)
        if serializers.is_valid():
            username = serializers.data["username"]
            password = serializers.data["password"]
            if User.objects.filter(username=username): 
                user = authenticate(username=username,password=password)
                if not user:
                    response_data = {'message':'Invalid Credential'}
                    return Response(response_data, status=400)
                
                user_data = get_auth_for_user(user)
                return Response(user_data, status=200)
            else:
                return Response(
                    {
                        "status": "error",
                        "detail": "User Not Found",
                    },
                    status=404,
                )
        else:
            return Response(
                {"status": "failure", "detail": serializers.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

class AddInstitutionAPI(generics.GenericAPIView):
    """ check for require permission for adding a institution """
    permission_classes = [permissions.IsAuthenticated,APILevelPermissionCheck]
    required_permissions = [ "setup.add_institution"]

    serializer_class = AddInstitutionSerializer
    def post(self, request,*args, **kwargs):
        """ for adding  institution"""
        serializers = self.serializer_class(data=request.data)
        if serializers.is_valid():
            username = serializers.validated_data['username']
            email = serializers.validated_data['email']
            if Institution.objects.filter(username=username):
              return Response(
                    {"status": "failure", "detail": "username Already Exist"},
                    status=400,
                )  
            if Institution.objects.filter(email=email):
              return Response(
                    {"status": "failure", "detail": "email Already Exist"},
                    status=400,
                )  

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
            
  
class GetAllInstitutionsAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    required_permissions = [ "setup.view_institution"]

    serializer_class = AddInstitutionSerializer
    def get(self, request,*args, **kwargs):
        institutions = Institution.objects.all().order_by('-created_at')
        serializers = self.serializer_class(institutions,many=True)
        return Response(
            {"status": "success", "detail": serializers.data},
            status=200
        )          
            
class AddUserAPI(generics.GenericAPIView):
    """ check for require permission for adding a user """
    permission_classes = [permissions.IsAuthenticated,APILevelPermissionCheck]
    required_permissions = [ "setup.add_user"]

    serializer_class = UserRegistrationSerializer
    def post(self, request,*args, **kwargs):
        """ for adding  user"""
        serializers = self.serializer_class(data=request.data)
        if serializers.is_valid():
            institution = serializers.validated_data['institution']
            password = serializers.validated_data['password']
            try:    
                user = User.objects.create_user(username=institution.usernane, email=institution.email, password=password, institution=institution,created_by=request.user)
                user.save()
                return Response(
                    {
                        "status": "success",
                        "detail": "User added Successfully",
                    },
                    status=status.HTTP_201_CREATED,
                )
            except Institution.DoesNotExist:
                return Response(
                    {"status": "error", "detail":"institution Not Found"},
                    status=404
                )
        else:
            return Response(
                {"status": "failure", "detail": serializers.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )