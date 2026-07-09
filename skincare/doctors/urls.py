from django.urls import path
from . import views

urlpatterns = [
    path('', views.doctor_list, name='doctor_list'),
    path('<int:doctor_id>/', views.doctor_detail, name='doctor_detail'),
    path('add/',views.add_doctor,name='add_doctor'),
    path('edit/<int:pk>/', views.edit_doctor, name='edit_doctor'),
    path('delete/<int:pk>/', views.delete_doctor, name='delete_doctor'),
    path('inactive/', views.inactive_doctors, name='inactive_doctors'),
    path('activate/<int:pk>/', views.activate_doctor, name='activate_doctor'),
]
