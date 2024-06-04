from django.contrib.auth import get_user_model
from rest_framework import serializers
from assets.models import *
from users.serializers import *
User = get_user_model()



        
class GettAllTagSerializer(serializers.ModelSerializer):
    created_by = UserSerializer()
    class Meta:
        model = Tag
        fields = '__all__'
        
class DeleteTagSerializer(serializers.Serializer):
    tag_id = serializers.CharField(max_length=254)

          
        
class GettAllProductSerializer(serializers.ModelSerializer):
    created_by = UserSerializer()
    tag = GettAllTagSerializer()
    class Meta:
        model = Product
        fields = '__all__'
        
class DeleteProductSerializer(serializers.Serializer):
    product_id = serializers.CharField(max_length=254)
    
    
class AddAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = ['product','owner']
        
        
        
class GetAllAssetSerializer(serializers.ModelSerializer):
    product = GettAllProductSerializer()
    owner = UserLoginSerializer()
    created_by = UserSerializer()
    class Meta:
        model = Asset
        fields = '__all__'
        
        
class DeleteAssetSerializer(serializers.Serializer):
    asset_id = serializers.CharField(max_length=254)
    