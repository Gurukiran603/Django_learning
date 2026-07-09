from django.urls import path
from . import views


urlpatterns=[
    #-----------------------ARTICLE-------------------------------
path('home/',views.home, name='home'),
path('',views.read_article, name='read_article'),
path('update_article/<int:pk>/',views.update_article, name='update_article'),
path('delete_article/<int:pk>/',views.delete_article, name='delete_article'),
path('history_article/',views.history_article, name='history_article'),
path('restore_article/<int:pk>/',views.restore_article, name='restore_article'),

#-----------------------CATEGORY-----------------------------------
path('create_category/',views.create_category, name='create_category'),
path('read_category/',views.read_category, name='read_category'),
path('update_category/<int:pk>/',views.update_category, name='update_category'),
path('delete_category/<int:pk>/',views.delete_category, name='delete_category'),

]

