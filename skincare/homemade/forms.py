from .models import HomeMadeRemedy
from django import forms

class HomemadeForm(forms.ModelForm):
    class Meta:
        model = HomeMadeRemedy
        fields = '__all__'
