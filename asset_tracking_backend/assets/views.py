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
            
            
            
class AddProductAPI(SimpleCrudMixin):
    """ check for require permission for adding a product """
    permission_classes = [permissions.IsAuthenticated,APILevelPermissionCheck]
    required_permissions = [ "setup.manage_product"]

    serializer_class = GettAllProductSerializer
    form_class = ProductForm
    def post(self, request,*args, **kwargs):
        form = self.form_class(request.data)
        if form.is_valid():
            product = form.save()
            product.created_by = request.user
            product.save()
            return Response(self.serializer_class(form.instance).data,
                    status=status.HTTP_201_CREATED,
                )
        else:
            return Response(
                {"error_message": get_errors_from_form(form)},
                status=200,
            )
  
class GetAvailableProductsAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    required_permissions = [ "setup.manage_product"]

    serializer_class = GettAllProductSerializer
    def get(self, request,*args, **kwargs):
        products = Product.objects.filter(availability="Available").all().order_by('-created_at')
        serializers = self.serializer_class(products,many=True)
        return Response(
            {"status": "success", "success_message": serializers.data},
            status=200
        )          
        
        
class ProductsAPI(SimpleCrudMixin):
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    required_permissions = [ "setup.manage_product"]

    serializer_class = GettAllProductSerializer
    model_class = Product
        
  
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
            serializer = GetAllAssetSerializer(asset)
            return Response(serializer.data,
                    status=status.HTTP_201_CREATED,
                )
        else:
            return Response(
                {"status": "failure", "error_message": serializers.errors},
                status=200,
            )
            
            
class GetAllAsssetsAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]

    serializer_class = GetAllAssetSerializer
    def get(self, request,*args, **kwargs):
        if not request.user.has_perm("setup.view_all_assets"):
            assets = Asset.objects.filter(owner=request.user).all().order_by('-created_at')
            serializers = self.serializer_class(assets,many=True)
            return Response(
                {"status": "success", "success_message": serializers.data},
                status=200
            )          
        assets = Asset.objects.all().order_by('-created_at')
        serializers = self.serializer_class(assets,many=True)
        return Response(
            {"status": "success", "success_message": serializers.data},
            status=200
        )   
        
class DeleteAssetAPI(SimpleCrudMixin):
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    required_permissions = [ "setup.delete_asset"]

    serializer_class = GetAllAssetSerializer
    model_class = Asset

class ChangeAssetStatusAPI(generics.GenericAPIView):
    """ check for require permission for changing a asset  status"""
    permission_classes = [permissions.IsAuthenticated]

    serializer_class = ChangeAssetStatusSerializer
    def post(self, request,*args, **kwargs):
        serializers = self.serializer_class(data=request.data)
        if serializers.is_valid():
            asset_id = serializers.data['asset_id']
            status = serializers.data['status']
            try:
                asset = Asset.objects.get(id=asset_id)
                asset.status = status
                asset.save()
                return Response(
                    {"status": "success", "success_message": "Asset  Status Updated"},
                    status=200
                )   
            except Asset.DoesNotExist:
                return Response(
                    {"status": "failure", "error_message": "File Not Found"},
                    status=200,
                ) 
        else:
            return Response(
                {"status": "failure", "error_message": serializers.errors},
                status=200,
            )
            
class getUsersAssetAPI(generics.GenericAPIView):
    """ check for require permission for changing a asset  status"""
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    required_permissions = [ "setup.add_asset"]

    serializer_class = GetAllAssetSerializer
    def get(self, request, id, *args, **kwargs):
        try:
            user = User.objects.get(id=id)
            assets = Asset.objects.filter(owner=user).all().order_by('-created_at')
            serializers = self.serializer_class(assets,many=True)
            return Response(
                {"status": "success", "success_message": serializers.data},
                status=200
            )   
        except User.DoesNotExist:
            return Response(
                {"status": "failure", "error_message": "User Not Found"},
                status=200,
            ) 

# ON THE DASHBOARD PAGE
# TOTAL PRODUCTS
# TOTAL AVAILABLE PRODUCT 
# TOTAL TOTAL PRODUCT GIVE OUT
# TOTAL INSTITUTIONS
# TOTAL USERS

class DashboardAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    required_permissions = [ "setup.view_dashboard"]
    def get(self, request, *args, **kwargs):
        total_product_count = Product.objects.all().count()
        total_available_product_count = Product.objects.filter(availability="Available").all().count()
        total_product_giving_out_count = Asset.objects.all().count()
        total_institutions_count =  Institution.objects.all().count()
        total_users_count =  User.objects.all().count()
        total_tags_count =  Tag.objects.all().count()
        total_functional_assets_count = Asset.objects.filter(status="Functional").all().count()
        total_assets_in_maintenance_count = Asset.objects.filter(status="Maintenance").all().count()
        total_spoilt_assets_count = Asset.objects.filter(status="Spoilt").all().count()

        return Response({
            "total_product_count": total_product_count,
            "total_available_product_count": total_available_product_count,
            "total_product_giving_out_count": total_product_giving_out_count,
            "total_institutions_count": total_institutions_count,
            "total_users_count": total_users_count,
            "total_tags_count": total_tags_count,
            "total_functional_assets_count": total_functional_assets_count,
            "total_assets_in_maintenance_count": total_assets_in_maintenance_count,
            "total_spoilt_assets_count": total_spoilt_assets_count,
        })



 
