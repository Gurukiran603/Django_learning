from django.urls import path
from . import views

urlpatterns = [
    path('', views.homemade_list, name='homemade_list'),
    path('add/', views.add_remedy, name='add_remedy'),
    path('edit/<int:pk>/', views.edit_remedy, name='edit_remedy'),
    path('delete/<int:pk>/', views.delete_remedy, name='delete_remedy'),
    path('products/<int:pk>/', views.homemaderemedy_detail_view, name='homemaderemedy_detail_view'),
]
