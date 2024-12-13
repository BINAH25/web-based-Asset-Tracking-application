from django.urls import path
from . import views

app_name = "users"

urlpatterns = [
    path("auth/login/", views.SignInAPI.as_view()),
    path("auth/logout/", views.LogOutAPI.as_view()),
    path("auth/change-own-password/", views.ChangeOwnPassword.as_view()),
    path("auth/otp/verify/", views.OTPVerifyAPI.as_view()),
    path("auth/register/", views.AddUserAPI.as_view()),
    path("institutions/", views.InstitutionAPI.as_view()),
    path("get/all/new/institutions/", views.GetAllNewInstitutionAPI.as_view()),
    path("users/", views.UsersAPI.as_view()),
    path("activity/logs/", views.ActivityLogAPI.as_view()),
  
]