from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from users.models import *
from assets.serializers import *
from utils.permissions import APILevelPermissionCheck
from utils.user_permissions import get_all_user_permissions
from django.shortcuts import HttpResponse
from django.db.models import Q
User = get_user_model()
# Create your views here.

class AddTagAPI(generics.GenericAPIView):
    """ check for require permission for adding a tag """
    permission_classes = [permissions.IsAuthenticated,APILevelPermissionCheck]
    required_permissions = [ "setup.add_tag"]

    serializer_class = AddTagSerializer
    def post(self, request,*args, **kwargs):
        """ for adding  tag"""
        serializers = self.serializer_class(data=request.data)
        if serializers.is_valid():
            new_tag = serializers.save(uploaded_by=request.user) 
            return Response(
                    {
                        "status": "success",
                        "detail": "tag added Successfully",
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

    serializer_class = AddTagSerializer
    def get(self, request,*args, **kwargs):
        institutions = Institution.objects.all().order_by('-created_at')
        serializers = self.serializer_class(institutions,many=True)
        return Response(
            {"status": "success", "detail": serializers.data},
            status=200
        )          
            