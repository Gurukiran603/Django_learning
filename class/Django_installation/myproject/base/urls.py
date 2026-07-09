from django.urls import path #to create url
from . import views #to import views.py file    # .[ it will take the views from the same directory ]

urlpatterns = [
    path('', views.home, name='home'),  # url pattern  # route to the home view
    path('about/<int:pk>/', views.about, name='about'),  # url pattern  # route to the about view
]

