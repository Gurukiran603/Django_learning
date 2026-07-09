from django.shortcuts import render, redirect, get_object_or_404
from .models import Task
from .forms import TaskForm

from django.contrib import messages

# CREATE
def home(request):
    form = TaskForm(request.POST or None)
    if form.is_valid():
        form.save()
        messages.success(request, 'Task added successfully!')
        return redirect('read_article')  # keep same name
    return render(request, 'home.html', {'form': form})


# READ
def read_article(request):
    data = Task.objects.all()
    return render(request, 'read_article.html', {'data': data})


# UPDATE
def update_article(request, pk):
    data = get_object_or_404(Task, id=pk)
    form = TaskForm(request.POST or None, instance=data)
    if form.is_valid():
        form.save()
        messages.success(request, 'Task updated successfully!')
        return redirect('read_article')
    return render(request, 'update_article.html', {'form': form})


# DELETE
def delete_article(request, pk):
    data = get_object_or_404(Task, id=pk)
    if request.method == 'POST':
        data.delete()
        messages.success(request, 'Task deleted successfully!')
        return redirect('read_article')
    return render(request, 'delete_article.html', {'data': data})