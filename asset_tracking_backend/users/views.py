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
User = get_user_model()
# Create your views here.

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
                context = {
                "otp": otp,
                }
                html_message = render_to_string("otp.html",context)
                plain_message = strip_tags(html_message)
                try:
                    message = EmailMultiAlternatives(
                    subject="One Time Password",
                    body=plain_message,
                    from_email=settings.EMAIL_HOST_USER,
                    to=[email],
                )
                    message.attach_alternative(html_message, 'text/html')
                    message.send()
                    return Response(
                        {
                            "status": "success",
                            "message": f"OTP send to your email {email}",
                        },
                        status=status.HTTP_200_OK,
                    )
                except Exception as e:
                    return Response(
                        {
                            "status": "error",
                            "error_message": f"Error sending email: {e}, try again",
                        },
                        status=200,
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
    add_permissions = ["setup.add_institution"]
    delete_permissions = ["setup.delete_institution"]
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
            try:    
                user = User.objects.create_user(username=institution.usernane, email=institution.email, password=password, institution=institution,created_by=request.user)
                user.save()
                institution = institution.status = "Completed"
                institution.save()
                return Response(
                    serializers.data,
                    status=status.HTTP_201_CREATED,
                )
            except Institution.DoesNotExist:
                return Response(
                    {"status": "error", "error_message":"institution Not Found"},
                    status=404
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
    required_permissions = [ "setup.view_user"]

    serializer_class = UserLoginSerializer
    model_class = User
    

class DeleteInstitutionAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated,APILevelPermissionCheck]
    required_permissions = [ "setup.delete_institution"]
    
    serializer_class = DeleteInstitutionSerializer
    def delete(self, request, *args, **kwargs):
        serializers = self.serializer_class(data=request.data)
        if serializers.is_valid():
            id = serializers.data['institution_id']
            try:
                institution = Institution.objects.get(id=id)
                institution.delete()
                return Response(
                    {
                        "status": "success",
                        "detail": "Institution Deleted Successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            except Institution.DoesNotExist:
                return Response(
                    {"status": "error", "detail":"Institution Not Found"},
                    status=404
                )
        return Response(
            {"status": "failure", "detail": serializers.errors},
                status=status.HTTP_400_BAD_REQUEST,
        )
        
class DeleteUserAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated,APILevelPermissionCheck]
    required_permissions = [ "setup.delete_user"]
    
    serializer_class = DeleteUserSerializer
    def delete(self, request, *args, **kwargs):
        serializers = self.serializer_class(data=request.data)
        if serializers.is_valid():
            id = serializers.data['user_id']
            try:
                user = User.objects.get(id=id)
                user.delete()
                return Response(
                    {
                        "status": "success",
                        "detail": "User Deleted Successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            except User.DoesNotExist:
                return Response(
                    {"status": "error", "detail":"User Not Found"},
                    status=404
                )
        return Response(
            {"status": "failure", "detail": serializers.errors},
                status=status.HTTP_400_BAD_REQUEST,
        )