from django.shortcuts import render, get_object_or_404,redirect
from .forms import BlogForm
from .models import Blog
from django.contrib.auth.decorators import login_required

def blog_list(request):
    blogs = Blog.objects.filter(is_published=True).order_by('-created_at')
    return render(request, 'blog_list.html', {'blogs': blogs})

def blog_detail(request, blog_id):
    blog = get_object_or_404(Blog, id=blog_id, is_published=True)
    return render(request, 'blog_detail.html', {'blog': blog})

@login_required
def add_blog(request):
    if request.user.profile.role != 'admin':
        return redirect('dashboard')
    form = BlogForm(request.POST or None,request.FILES or None)
    if form.is_valid():
        form.save()
        return redirect('blog_list')
    return render(request, 'add_blog.html', {'form': form})

@login_required
def edit_blog(request, pk):
    blog = get_object_or_404(Blog, pk=pk)
    if request.method == 'POST':
        form = BlogForm(request.POST, request.FILES, instance=blog)
        if form.is_valid():
            form.save()
            return redirect('blog_list')
    else:
        form = BlogForm(instance=blog)
    return render(request, 'edit_blog.html', {'form': form})

@login_required
def delete_blog(request, pk):
    blog = get_object_or_404(Blog, pk=pk)
    if request.method == 'POST':
        blog.delete()
        return redirect('blog_list')
    return render(request, 'delete_blog.html', {'blog': blog})