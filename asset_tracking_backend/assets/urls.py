from django.urls import path
from . import views

app_name = "assets"

urlpatterns = [
    path("add/tag/", views.AddTagAPI.as_view()),
    path("get/all-tags/", views.GetAllTagsAPI.as_view()),
    path("delete/tag/", views.DeleteTagAPI.as_view()),  
  
]