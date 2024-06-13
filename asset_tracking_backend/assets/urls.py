from django.urls import path
from . import views

app_name = "assets"

urlpatterns = [
    #Tags
    path("add/tag/", views.AddTagAPI.as_view()),
    path("tags/", views.TagsAPI.as_view()),
    #product
    path("add/product/", views.AddProductAPI.as_view()),  
    path("products/", views.ProductsAPI.as_view()),  
    path("get/available/products/", views.GetAvailableProductsAPI.as_view()),  
    #asset 
    path("add/asset/", views.AddAssetAPI.as_view()),  
    path("get/all/assets/", views.GetAllAsssetsAPI.as_view()),  
    path("delete/asset/", views.DeleteAssetAPI.as_view()),  
    path("update/status/", views.ChangeAssetStatusAPI.as_view()),  
    path("user/<int:id>/", views.getUsersAssetAPI.as_view()),  
    path("dashboard/", views.DashboardAPI.as_view()),  
  
]