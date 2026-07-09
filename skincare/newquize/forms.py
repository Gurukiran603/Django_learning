from django import forms
from .models import Question, Option
from django.forms import formset_factory

class QuizForm(forms.Form):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        from .models import Question 
        questions = Question.objects.all()
        for question in questions:
            choices = [(opt.id, opt.text) for opt in question.option_set.all()]
            self.fields[f'question_{question.id}'] = forms.ChoiceField(
                label=question.text,
                choices=choices,
                widget=forms.RadioSelect,
                required=True
            )

class QuestionForm(forms.ModelForm):
    class Meta:
        model = Question
        fields = ['text']

class OptionForm(forms.ModelForm):
    class Meta:
        model = Option
        exclude = ['question']
        widgets = {
            'skin_type_weights': forms.Textarea(attrs={'rows': 2, 'placeholder': '{"oily": 2, "dry": 1}'}),
        }

OptionFormSet = formset_factory(OptionForm, extra=4)
