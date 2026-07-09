from django.urls import path
from . import views
urlpatterns=[
    path('home/',views.home, name='home'),
    path('',views.student_data, name='student_data'),  
    path('update_student/<int:pk>/',views.update_student, name='update_student'),
    path('delete_student/<int:pk>/',views.delete_student, name='delete_student'),
]