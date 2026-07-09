from django.urls import path
from . import views

urlpatterns =[
    path('home/',views.home,name='home'),
    path('',views.read_article,name='read_article'),
    path('update_article/<int:pk>',views.update_article,name='update_article'),
    path('delete_article/<int:pk>',views.delete_article,name='delete_article'),
]