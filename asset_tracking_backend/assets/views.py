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
            new_tag = serializers.save(created_by=request.user) 
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
            
  
class GetAllTagsAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    required_permissions = [ "setup.view_tags"]

    serializer_class = GettAllTagSerializer
    def get(self, request,*args, **kwargs):
        tags = Tag.objects.all().order_by('-created_at')
        serializers = self.serializer_class(tags,many=True)
        return Response(
            {"status": "success", "detail": serializers.data},
            status=200
        )          
            
            
class DeleteTagAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated,APILevelPermissionCheck]
    required_permissions = [ "setup.delete_tag"]
    serializer_class = DeleteTagSerializer
    def delete(self, request, *args, **kwargs):
        serializers = self.serializer_class(data=request.data)
        if serializers.is_valid():
            id = serializers.data['tag_id']
            try:
                tag = Tag.objects.get(id=id)
                tag.delete()
                return Response(
                    {
                        "status": "success",
                        "detail": "Tag Deleted Successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            except Tag.DoesNotExist:
                return Response(
                    {"status": "error", "detail":"Tag Not Found"},
                    status=404
                )
        return Response(
            {"status": "failure", "detail": serializers.errors},
                status=status.HTTP_400_BAD_REQUEST,
        )
            