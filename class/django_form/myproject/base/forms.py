from django import forms
from .models import Article
from .models import Category

class ArticleForm(forms.ModelForm):  #form
    class Meta:      # to replace the input tag
        model = Article
        fields = '__all__' # to display all the fields in the form

class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = '__all__'