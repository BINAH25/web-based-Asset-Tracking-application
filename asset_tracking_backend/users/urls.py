from django.urls import path
from . import views

app_name = "users"

urlpatterns = [
    path("institution/add/", views.AddInstitutionAPI.as_view()),
    path("auth/register/", views.AddUserAPI.as_view()),
    path("auth/login/", views.SignInAPI.as_view()),
  
]