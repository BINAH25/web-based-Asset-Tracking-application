from django.urls import path
from . import views

app_name = "users"

urlpatterns = [
    path("institution/add/", views.AddInstitutinAPI.as_view()),
  
]