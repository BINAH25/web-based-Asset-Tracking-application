from django.urls import path
from . import views

app_name = "assets"

urlpatterns = [
    #Tags
    path("add/tag/", views.AddTagAPI.as_view()),
    path("get/all-tags/", views.GetAllTagsAPI.as_view()),
    path("delete/tag/", views.DeleteTagAPI.as_view()),  
    #product
    path("add/product/", views.AddProductAPI.as_view()),  
    path("get/all-products/", views.GetAllProductsAPI.as_view()),  
    path("delete/product/", views.DeleteProductAPI.as_view()), 
    #asset 
    path("add/asset/", views.AddAssetAPI.as_view()),  
  
]