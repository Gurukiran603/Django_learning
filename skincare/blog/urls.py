
from django.urls import path
from . import views

urlpatterns = [
    path('', views.blog_list, name='blog_list'),
    path('<int:blog_id>/', views.blog_detail, name='blog_detail'),
    path('add/', views.add_blog, name='add_blog'),
    path('edit/<int:pk>/', views.edit_blog, name='edit_blog'),
    path('delete/<int:pk>/', views.delete_blog, name='delete_blog'),
    

    

]
