from django.shortcuts import render,redirect, get_object_or_404
from .models import Article

from django.contrib import messages
from django.db.models import Q # to target the entered data


# Create your views here.
def home(request):
    if request.method == "POST":
        Article.objects.create(
            title = request.POST['title'],
            desc = request.POST['desc'],
            author = request.POST['author'],
            cost = request.POST['cost'],
        )
        messages.success(request,'Article created successfullly !....')
        return redirect('read_article')
    return render(request,'home.html')


# -----------------Read--------------------------------------------------


def read_article(request):
    search=request.GET.get('q') #it will recvie the data written in input tag of search bar
    if search:
        data = Article.objects.filter(
            Q(title__icontains = search) |
            Q(desc__icontains = search) |
            Q(author__icontains = search) |
            Q(cost__icontains = search)
        )
    else:
        data = Article.objects.all()  # extracted data
    return render(request,'read_article.html',{'sakshi':data,'search':search })  #data is sent to read_article.html and sakshi is the name of variable which will be used in html file to access the data

#------------------Update------------------------------------------------

def update_article(request,pk):
    data = get_object_or_404(Article,id=pk)  #extracted data
    if request.method == "POST":
        #var.key = new_value
        data.title = request.POST['title']
        data.desc = request.POST['desc']
        data.author = request.POST['author']
        data.cost = request.POST['cost']
        data.save()   # compulsary to save the data
        messages.success(request,'Article updated successfully !....')
        return redirect('read_article')
    return render(request,'update_article.html',{'sakshi':data})

#----------------------------delete------------------------------------------------------

def delete_article(request,pk):
    #extract data and delete the data
    data = get_object_or_404(Article,id=pk)
    if request.method == "POST":
        data.delete()
        messages.success(request,'Article dleteed successfullyyy !...')
        return redirect('read_article')
    return render(request,'delete_article.html',{'sakshi':data})