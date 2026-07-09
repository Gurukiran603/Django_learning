from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect,get_object_or_404
from .forms import ProductForm
from .models import Product

def product_list(request):
    skin_type = request.user.profile.skin_type if request.user.is_authenticated else None
    selected_category = request.GET.get('category')
    products = Product.objects.filter(is_active=True)
    #if skin_type:
     #   products = products.filter(skin_type=skin_type)
    if selected_category:
        products = products.filter(category=selected_category)


    categories = Product.objects.values_list('category', flat=True).distinct()

    return render(request, 'product_list.html', {
        'products': products,
        'skin_type': skin_type,
        'categories': categories,
        'selected_category': selected_category,
    })

@login_required
def add_product(request):
    if request.user.profile.role != 'admin':
        return redirect('dashboard') 

    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('product_list')
    else:
        form = ProductForm()

    return render(request, 'add_product.html', {'form': form})

@login_required
def edit_product(request, pk):
    product = get_object_or_404(Product, pk=pk)
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES, instance=product)
        if form.is_valid():
            form.save()
            return redirect('product_list')
    else:
        form = ProductForm(instance=product)
    return render(request, 'edit_product.html', {'form': form})

@login_required
def delete_product(request, pk):
    product = get_object_or_404(Product, pk=pk)
    if request.method == 'POST':
        product.delete()
        return redirect('product_list')
    return render(request, 'delete_confirm.html', {'product': product})



def product_detail_view(request, pk):
    product = get_object_or_404(Product, pk=pk)
    return render(request, 'product_detail.html', {'products': [product]})