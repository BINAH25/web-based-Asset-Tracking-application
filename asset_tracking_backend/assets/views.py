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
from assets.forms import *
from users.mixins import SimpleCrudMixin
from utils.form_error import get_errors_from_form
User = get_user_model()
# Create your views here.

class AddTagAPI(SimpleCrudMixin):
    """ check for require permission for adding a tag """
    permission_classes = [permissions.IsAuthenticated,APILevelPermissionCheck]
    required_permissions = [ "setup.add_tag"]

    serializer_class = GettAllTagSerializer
    form_class = TagForm
    def post(self, request,*args, **kwargs):
        form = self.form_class(request.data)
        if form.is_valid():
            tag = form.save()
            tag.created_by = request.user
            tag.save()
            return Response(self.serializer_class(form.instance).data,
                    status=status.HTTP_201_CREATED,
                )
        else:
            return Response(
                {"error_message": get_errors_from_form(form)},
                status=200,
            )
    

  
class TagsAPI(SimpleCrudMixin):
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    required_permissions = [ "setup.view_tag", "setup.delete_tag"]

    serializer_class = GettAllTagSerializer
    model_class = Tag
            
# class DeleteTagAPI(generics.GenericAPIView):
#     permission_classes = [permissions.IsAuthenticated,APILevelPermissionCheck]
#     required_permissions = [ "setup.delete_tag"]
#     serializer_class = DeleteTagSerializer
#     def delete(self, request, *args, **kwargs):
#         serializers = self.serializer_class(data=request.data)
#         if serializers.is_valid():
#             id = serializers.data['tag_id']
#             try:
#                 tag = Tag.objects.get(id=id)
#                 tag.delete()
#                 return Response(
#                     {
#                         "status": "success",
#                         "detail": "Tag Deleted Successfully",
#                     },
#                     status=status.HTTP_200_OK,
#                 )
#             except Tag.DoesNotExist:
#                 return Response(
#                     {"status": "error", "detail":"Tag Not Found"},
#                     status=404
#                 )
#         return Response(
#             {"status": "failure", "detail": serializers.errors},
#                 status=status.HTTP_400_BAD_REQUEST,
#         )
            
            
class AddProductAPI(generics.GenericAPIView):
    """ check for require permission for adding a product """
    permission_classes = [permissions.IsAuthenticated,APILevelPermissionCheck]
    required_permissions = [ "setup.add_product"]

    serializer_class = AddProductSerializer
    def post(self, request,*args, **kwargs):
        """ for adding  product"""
        serializers = self.serializer_class(data=request.data)
        if serializers.is_valid():
            product = serializers.save(created_by=request.user) 
            return Response(
                    {
                        "status": "success",
                        "detail": "product added Successfully",
                    },
                    status=status.HTTP_201_CREATED,
                )
        else:
            return Response(
                {"status": "failure", "detail": serializers.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
            
  
class GetAllProductsAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    required_permissions = [ "setup.view_product"]

    serializer_class = GettAllProductSerializer
    def get(self, request,*args, **kwargs):
        products = Product.objects.filter(availability="Available").all().order_by('-created_at')
        serializers = self.serializer_class(products,many=True)
        return Response(
            {"status": "success", "detail": serializers.data},
            status=200
        )          
        
        
class DeleteProductAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated,APILevelPermissionCheck]
    required_permissions = [ "setup.delete_product"]
    
    serializer_class = DeleteProductSerializer
    def delete(self, request, *args, **kwargs):
        serializers = self.serializer_class(data=request.data)
        if serializers.is_valid():
            id = serializers.data['product_id']
            try:
                product = Product.objects.get(id=id)
                product.delete()
                return Response(
                    {
                        "status": "success",
                        "detail": "Product Deleted Successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            except Product.DoesNotExist:
                return Response(
                    {"status": "error", "detail":"Product Not Found"},
                    status=404
                )
        return Response(
            {"status": "failure", "detail": serializers.errors},
                status=status.HTTP_400_BAD_REQUEST,
        )
        
class AddAssetAPI(generics.GenericAPIView):
    """ check for require permission for adding a asset """
    permission_classes = [permissions.IsAuthenticated,APILevelPermissionCheck]
    required_permissions = [ "setup.add_asset"]

    serializer_class = AddAssetSerializer
    def post(self, request,*args, **kwargs):
        """ for adding  asset"""
        serializers = self.serializer_class(data=request.data)
        if serializers.is_valid():
            product = serializers.validated_data['product']
            asset = serializers.save(created_by=request.user) 
            product.availability = "Unavailable"
            product.save()
            return Response(
                    {
                        "status": "success",
                        "detail": "asset added Successfully",
                    },
                    status=status.HTTP_201_CREATED,
                )
        else:
            return Response(
                {"status": "failure", "detail": serializers.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
            
            
class GetAllAsssetsAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]

    serializer_class = GetAllAssetSerializer
    def get(self, request,*args, **kwargs):
        if not request.user.has_perm("setup.view_all_assets"):
            assets = Asset.objects.filter(owner=request.user).all().order_by('-created_at')
            serializers = self.serializer_class(assets,many=True)
            return Response(
                {"status": "success", "detail": serializers.data},
                status=200
            )          
        assets = Asset.objects.all().order_by('-created_at')
        serializers = self.serializer_class(assets,many=True)
        return Response(
            {"status": "success", "detail": serializers.data},
            status=200
        )   
        
class DeleteAssetAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated,APILevelPermissionCheck]
    required_permissions = [ "setup.delete_asset"]
    
    serializer_class = DeleteAssetSerializer
    def delete(self, request, *args, **kwargs):
        serializers = self.serializer_class(data=request.data)
        if serializers.is_valid():
            id = serializers.data['asset_id']
            try:
                asset = Asset.objects.get(id=id)
                asset.delete()
                return Response(
                    {
                        "status": "success",
                        "detail": "Asset Deleted Successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            except Asset.DoesNotExist:
                return Response(
                    {"status": "error", "detail":"Asset Not Found"},
                    status=404
                )
        return Response(
            {"status": "failure", "detail": serializers.errors},
                status=status.HTTP_400_BAD_REQUEST,
        )