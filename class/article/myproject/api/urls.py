from django.urls import path
from .views import *
from . import views
from django.urls import include, path
from django.contrib import admin
urlpatterns = [
    path('emp/',views.employee_read_create),
    path('emp/<int:pk>/',views.employee_update_delete),
]