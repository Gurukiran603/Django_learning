from django.shortcuts import render, redirect
from .models import Option
from .forms import QuizForm, QuestionForm, OptionFormSet
from collections import defaultdict
from django.contrib.auth.decorators import login_required


def take_quiz(request):
    if request.method == 'POST':
        form = QuizForm(request.POST)
        if form.is_valid():
            scores = defaultdict(int)
            for field_name, option_id in form.cleaned_data.items():
                option = Option.objects.get(id=option_id)
                for skin_type, weight in option.skin_type_weights.items():
                    scores[skin_type] += weight
            suggested_skin_type = max(scores, key=scores.get)
            request.session['suggested_skin_type'] = suggested_skin_type
            return redirect('confirm_skin_type')
    else:
        form = QuizForm()
    return render(request, 'quiz.html', {'form': form})

@login_required
def confirm_skin_type(request):
    skin_type = request.session.get('suggested_skin_type')
    if not skin_type:
        return redirect('take_quiz')
    if request.method == 'POST':
        if 'confirm' in request.POST:
            request.user.profile.skin_type = skin_type
            request.user.profile.save()
        return redirect('user_dashboard') 
    return render(request, 'confirm_skin_type.html', {'skin_type': skin_type})

@login_required
def add_question_with_options(request):
    if request.method == 'POST':
        q_form = QuestionForm(request.POST)
        formset = OptionFormSet(request.POST)
        if q_form.is_valid() and formset.is_valid():
            question = q_form.save()
            for option_form in formset:
                if option_form.cleaned_data.get('text'):
                    option = option_form.save(commit=False)
                    option.question = question
                    option.save()
            return redirect('add_question_with_options')
    else:
        q_form = QuestionForm()
        formset = OptionFormSet()
    return render(request, 'add_question_with_options.html', {
        'q_form': q_form,
        'formset': formset
    })
