from django.urls import path
from . import views

urlpatterns = [
    path('home/', views.home, name='home'),#/ → opens home page
    path('', views.read_article, name='read_article'),#/read/ → shows all tasks
    path('update/<int:pk>/', views.update_article, name='update_article'),#Opens task with id = 1
    path('delete/<int:pk>/', views.delete_article, name='delete_article'), #👉 pk = primary key, unique identifier for each task
    #Delete specific task
]