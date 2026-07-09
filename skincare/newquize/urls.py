from django.urls import path
from . import views


urlpatterns = [
    path('', views.take_quiz, name='take_quiz'),
    path('confirm/', views.confirm_skin_type, name='confirm_skin_type'),
    path('add-question-options/', views.add_question_with_options, name='add_question_with_options'),
]
