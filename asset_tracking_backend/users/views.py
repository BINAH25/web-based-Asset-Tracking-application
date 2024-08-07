import logging
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
import random
from django.utils import timezone
import datetime
from users.forms import *
from users.mixins import SimpleCrudMixin
from users.tasks import *
User = get_user_model()
logger = logging.getLogger('user_activity')
# Create your views here.

def try_function(request):
    test.delay()
    return HttpResponse("Done")

def get_auth_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'user':UserLoginSerializer(user).data,
        'user_permissions':get_all_user_permissions(user),
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
                    response_data = {'error_message':'Invalid Credential'}
                    return Response(response_data, status=200)
                
                # Generate OTP 
                email = user.email
                otp = random.randint(1000, 9999)
                print(otp)
                otp_expiry = timezone.now() + datetime.timedelta(minutes=10)
                user.otp = otp
                user.otp_expiration = otp_expiry
                user.save()
               
               # Call Celery task to send email
                send_otp_mail.delay(email, otp)
                return Response(
                    {
                        "status": "success",
                        "message": f"OTP send to your email {email}",
                    },
                    status=status.HTTP_200_OK,
                )
                
            else:
                return Response(
                    {
                        "status": "error",
                        "error_message": "User Not Found",
                    },
                    status=200,
                )
        else:
            return Response(
                {"status": "failure", "error_message": serializers.errors},
                status=200,
            )
            
class OTPVerifyAPI(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = OTPVerifySerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            otp = serializer.data['otp']
            try:
                user = User.objects.get(otp=otp)
                if user.otp == otp and user.otp_expiration > timezone.now():
                    user.otp = None
                    user.otp_expiration = None
                    user.save()
                    user_data = get_auth_for_user(user)
                    return Response(user_data, status=status.HTTP_200_OK)
                return Response({"error_message": "expired OTP."}, status=200)
            except User.DoesNotExist:
                return Response({"error_message": "Invalid OTP."}, status=200)
        return Response(
                {"status": "failure", "error_message": serializers.errors},
                status=200,
            )

class InstitutionAPI(SimpleCrudMixin):
    """ check for require permission for adding a institution """
    permission_classes = [permissions.IsAuthenticated,APILevelPermissionCheck]
    required_permissions = ["setup.add_institution", "setup.delete_institution"]
    model_class = Institution
    serializer_class = AddInstitutionSerializer
    form_class = InstitutionForm

   
 
            
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
            
            if len(password) < 4:
                return Response(
                    {"status": "error", "error_message":"Password Must be At least four characters"},
                    status=200
                )
            try: 
                email=institution.email  
                username=institution.username 
                name = institution.institution_name 
                user = User.objects.create_user(username=institution.username, email=institution.email, password=password, institution=institution,created_by=request.user)
                institution.status = "Completed"
                institution.save()
                user.save()
                serializer = UserLoginSerializer(user)
                # Call Celery task to send email
                send_account_registration_mail.delay(email, username, name, password)
                return Response(
                    serializer.data,
                    status=status.HTTP_201_CREATED,
                )
            except Institution.DoesNotExist:
                return Response(
                    {"status": "error", "error_message":"institution Not Found"},
                    status=200
                )
        else:
            return Response(
                {"status": "failure", "error_message": serializers.errors},
                status=200,
            )
 
class GetAllNewInstitutionAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    required_permissions = [ "setup.view_institution"]

    serializer_class = AddInstitutionSerializer

    def get(self, request,*args, **kwargs):
        institutions = Institution.objects.filter(status="New").all().order_by('-created_at')
        serializers = self.serializer_class(institutions,many=True)
        return Response(
            {"status": "success", "success_message": serializers.data},
            status=200
        )       
                   
class UsersAPI(SimpleCrudMixin):
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    required_permissions = [ "setup.view_user", "setup.delete_user"]

    serializer_class = UserLoginSerializer
    model_class = User
    
        
class LogOutAPI(generics.GenericAPIView):
    """Logout API view to blacklist refresh token"""

    permission_classes = [permissions.IsAuthenticated]
    def post(self, request,*args, **kwargs):
        refresh_token = request.data["refresh"]
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"status": "success","success_message": "Successfully logged out."}, status=200)
        except Exception as e:
            return Response({"status": "error","error_message": f"Error logging out. {e}"}, status=200)


class ChangeOwnPassword(generics.GenericAPIView):
    """
    Change password of personal user accounts.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        if len(new_password) < 4:
            return Response(
                {"status": "error", "error_message":"Password Must be At least four characters"},
                status=200
            )
        
        user = request.user
        if old_password and new_password and user and user.check_password(old_password):
            user.set_password(new_password)
            user.changed_password = True
            user.save()
            user_data = get_auth_for_user(user)
            return Response(user_data, status=status.HTTP_200_OK)
        elif user:
            return Response({"status": "error", "error_message": "Invalid old password."})
        else:
            return Response({"status": "error", "error_message": "Invalid session. Please logout and login again"})

class ActivityLogAPI(SimpleCrudMixin):
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    required_permissions = [ "setup.view_activity_log"]

    serializer_class = UserActivityLogSerializer
    model_class = ActivityLog
        