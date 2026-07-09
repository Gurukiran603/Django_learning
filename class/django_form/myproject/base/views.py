from django.shortcuts import render,redirect,get_object_or_404
from .models import Article
from .forms import ArticleForm
from django.contrib import messages
from django.db.models import Q
from django.contrib.auth.decorators import login_required
from .models import Category
from .forms import CategoryForm
from django.utils import timezone



#------------------------CREATE-------------------------------------

def home(request):
    form = ArticleForm(request.POST, request.FILES or None)
    if form.is_valid():
        form.save()
        messages.success(request, 'Article created successfully!')
        return redirect('read_article')
    return render(request,'home.html',{'form':form})
    
#----------------------READ-----------------------------------
# extract data and display the data
@login_required(login_url='signin')
def read_article(request):   # view
    search = request.GET.get('q')
    category_id = request.GET.get('category')
    data = Article.objects.filter(is_deleted = False)  # the data which is not deleted is extracted here
    if search :
        data = data.filter(
            Q(title__icontains = search) |
            Q(desc__icontains = search) |
            Q(author__icontains = search) |
            Q(cost__icontains = search) |
            Q(category__name__icontains=search)
        )
    if category_id:
        data = data.filter(type = category_id)
        
    categories = Category.objects.all()    
    return render(request, 'read_article.html',{'data':data,'search':search, 'categories':categories, 'selected_category':category_id})

#-----------------------UPDATE--------------------------------------
#extarct the data and update the data
def update_article(request,pk):
    data = get_object_or_404(Article,id=pk,is_deleted=False) # extract the data based on id and is_deleted=False
    # form = ArticleForm(request.POST or None, request.FILES or None, instance=data)
    # if form.is_valid():
    #     form.save()
    #     messages.success(request, 'Article updated successfully!')
    #     return redirect('read_article')

    if request.method == 'POST':
        form = ArticleForm(request.POST or None, request.FILES or None, instance=data)
        if form.is_valid():
            form.save()
            messages.success(request, 'Article updated successfully!')
            return redirect('read_article')
    else:
        form = ArticleForm(instance=data)
    return render(request,'update_article.html',{'form':form})

#--------------------------DELETE-----------------------------------------
#extract data and delall data
def delete_article(request,pk):
    data = get_object_or_404(Article,id=pk,is_deleted=False) # extract the data based on id and is_deleted=False
    if request.method=='POST':
        data.delete()
        messages.success(request, 'Article deleted successfully!')
        return redirect('read_article')
    return render(request,'delete_article.html',{'data':data})






#-----------------------CATEGORY-------------------------------
from .models import Category
from .forms import CategoryForm

#--------------------------CREATE-------------------------------------
@login_required(login_url='signin')#saying to navigate to signin if not logged in if
def create_category(request):
    if request.method == 'POST':
        form = CategoryForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, 'Category created successfully!')
            return redirect('read_category')
    else:
        form = CategoryForm()
    return render(request,'create_category.html',{'form':form})

#-------------------------READ--------------------------------------
@login_required(login_url='signin')#saying to navigate to signin if not logged in if
def read_category(request):
    search = request.GET.get('search') # extract the search keyword
    category_id = request.GET.get('category') # extract the category id from the url
    data = Category.objects.all()

    if search:
        data = data.filter(
        Q(name__icontains=search) |
        Q(desc__icontains=search)
        ) # filter the data based on search keyword
    if category_id:
        data = data.filter(id=category_id) # filter the data based on category id
    categories = Category.objects.all() # extract the data which is not deleted to display in the dropdown
    return render(request,'read_category.html',{'data':data,'search':search,'categories':categories,'selected_category':category_id}) # pass the data and search keyword and categories to the template to display in the dropdown and search box

#-------------------------UPDATE--------------------------------------
@login_required(login_url='signin')#saying to navigate to signin if not logged in if
def update_category(request, pk):
    data = get_object_or_404(Category, id=pk)
    if request.method == 'POST':
        form = CategoryForm(request.POST, request.FILES, instance=data)
        if form.is_valid():
            form.save()
            messages.success(request,'Category Created Successfully !...')
            return redirect('read_category') 
    else:
        form = CategoryForm(instance=data)
    return render(request,'update_category.html',{'form':form}) 

#-------------------------DELETE--------------------------------------
@login_required(login_url='signin')#saying to navigate to signin if not logged in if
def delete_category(request, pk):
    data = get_object_or_404(Category, id=pk)   # extract
    if request.method == 'POST':
        # data.delete()
        data.is_deleted = True # to mark the data as deleted
        data.deleted_at = timezone.now() # to store the time when the data is deleted
        data.save() # to save the changes in the database
        messages.success(request,'Category Deleted Successfully !...')
        return redirect('read_category')
    return render(request,'delete_category.html',{'data':data})
 
#-----------------------------------HISTORY----------------------------------------
@login_required(login_url='signin')#saying to navigate to signin if not logged in if
def history_article(request):
    search = request.GET.get('q') # extract the search keyword
    category_id = request.GET.get('category') # extract the category id from the url
    data = Article.objects.filter(is_deleted=True) # extract the data which is deleted
    if search:
        data = data.filter(Q(title__icontains=search)|
        Q(desc__icontains=search)|Q(author__icontains=search)|Q(cost__icontains=search)) # filter the data based on search keyword
    if category_id:
        data = data.filter(category__id=category_id) # filter the data based on category id
    categories = Category.objects.all(is_deleted=False) # extract the data which is not deleted to display in the dropdown
    return render(request,'history_article.html',{'data':data,'search':search,'categories':categories,'selected_category':category_id}) # pass the data and search keyword and categories to the template to display in the dropdown and search box

#-----------------------------RESTORE--------------------------------------
@login_required(login_url='signin')#saying to navigate to signin if not logged in if
def restore_article(request, pk):
    data = get_object_or_404(Article, id=pk, is_deleted=True) # extract the data which is deleted based on id
    if request.method == 'POST':
        data.is_deleted = False # to mark the data as not deleted
        data.deleted_at = None # to remove the time when the data is deleted
        data.save() # to save the changes in the database
        messages.success(request,'Article Restored Successfully !...')
        return redirect('history_article')
    return render(request,'restore_article.html',{'data':data})

# ______________________________________________________________________________________________________________________________________________________
