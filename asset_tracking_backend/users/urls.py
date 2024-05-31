from django.urls import path
from . import views

app_name = "users"

urlpatterns = [
    path("auth/login/", views.SignInAPI.as_view()),
    path("auth/otp/verify/", views.OTPVerifyAPI.as_view()),
    path("auth/register/", views.AddUserAPI.as_view()),
    path("add/institution/", views.AddInstitutionAPI.as_view()),
    path("get/all/institutions/", views.GetAllInstitutionsAPI.as_view()),
    path("get/all/users/", views.GetAllUsersAPI.as_view()),
  
]