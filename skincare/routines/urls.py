from django.urls import path
from . import views

urlpatterns = [
    path('select/', views.select_routine_type, name='select_routine_type'),
    path('build/<str:routine_type>/', views.build_routine, name='build_routine'),
    path('<str:routine_type>/', views.view_routine, name='view_routine'), 
    path('edit/<str:routine_type>/', views.edit_routine, name='edit_routine'),

]
