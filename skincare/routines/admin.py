# routines/admin.py
from django.contrib import admin
from .models import Routine, RoutineStep

admin.site.register(Routine)
admin.site.register(RoutineStep)
