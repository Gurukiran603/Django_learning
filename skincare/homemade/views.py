from django.shortcuts import render,redirect,get_object_or_404
from .models import HomeMadeRemedy
from django.contrib.auth.decorators import login_required
from .forms import HomemadeForm


def homemade_list(request):
    skin_type = request.user.profile.skin_type if request.user.is_authenticated else None
    category = request.GET.get('category')

    remedies = HomeMadeRemedy.objects.filter(is_active=True)

    #if skin_type:
        #remedies = remedies.filter(skin_type__in=[skin_type, 'all'])

    if category:
        remedies = remedies.filter(category=category)

    return render(request, 'homemade_list.html', {
        'remedies': remedies,
        'skin_type': skin_type,
    })

@login_required
def add_remedy(request):
    if request.user.profile.role != 'admin':
        return redirect('dashboard')
    form = HomemadeForm(request.POST or None,request.FILES or None)
    if form.is_valid():
        form.save()
        return redirect('homemade_list')
    return render(request, 'add_remedy.html', {'form': form})

@login_required
def edit_remedy(request, pk):
    product = get_object_or_404(HomeMadeRemedy, pk=pk)
    if request.method == 'POST':
        form = HomemadeForm(request.POST, request.FILES, instance=product)
        if form.is_valid():
            form.save()
            return redirect('homemade_list')
    else:
        form = HomemadeForm(instance=product)
    return render(request, 'edit_remedy.html', {'form': form})

@login_required
def delete_remedy(request, pk):
    product = get_object_or_404(HomeMadeRemedy, pk=pk)
    if request.method == 'POST':
        product.delete()
        return redirect('homemade_list')
    return render(request, 'delete_remedy.html', {'product': product})


def homemaderemedy_detail_view(request, pk):
    remedy = get_object_or_404(HomeMadeRemedy, pk=pk)
    return render(request, 'homemaderemedy_detail.html', {'remedy': remedy})