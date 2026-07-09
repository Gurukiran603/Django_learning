from django.urls import path
from . import views

urlpatterns = [
    path('home/', views.home, name='home'),
    path('', views.read_patients, name='read_patients'),
    path('update/<int:pk>/', views.update_patient, name='update_patient'),
    path('delete/<int:pk>/', views.delete_patient, name='delete_patient'),
    
]