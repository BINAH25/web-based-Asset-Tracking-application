from django.urls import path
from . import views

app_name = "assets"

urlpatterns = [
    path("add/tag/", views.AddTagAPI.as_view()),
  
]