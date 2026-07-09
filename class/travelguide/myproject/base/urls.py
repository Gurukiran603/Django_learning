from django.urls import path
from . import views
urlpatterns = [
    path('home/', views.home, name='home'),
    path('', views.read_destination, name='read_destination'),
    path('update_destination/<int:id>/', views.update_destination, name='update_destination'),
    path('delete_destination/<int:id>/', views.delete_destination, name='delete_destination'),
]