from django.shortcuts import render,redirect,get_object_or_404
from .forms import DestinationForm
from .models import Destination
from django.contrib import messages
from django.db.models import Q


# Create your views here.
def home(request):
    form = DestinationForm(request.POST or None)
    if form.is_valid():
        form.save()
        messages.success(request, 'Destination added successfully!')
        return redirect('read_destination')
    return render(request, 'home.html', {'form': form})

def read_destination(request):
    destinations = Destination.objects.all()
    search_query = request.GET.get('search', '')
    if search_query:
        destinations = destinations.filter(
            Q(name__icontains=search_query) |
            Q(country__icontains=search_query) |
            Q(description__icontains=search_query)|
            Q(average_cost__icontains=search_query)|
            Q(rating__icontains=search_query)
        )
    else:
        destinations = Destination.objects.all()
    return render(request, 'read_destination.html', {'destinations': destinations, 'search_query': search_query or ''})

def update_destination(request, id):
    destination = get_object_or_404(Destination, id=id)
    form = DestinationForm(request.POST or None, instance=destination)
    if form.is_valid():
        form.save()
        messages.success(request, 'Destination updated successfully!')
        return redirect('read_destination')
    return render(request, 'update_destination.html', {'form': form})

def delete_destination(request, id):
    destination = get_object_or_404(Destination, id=id)
    if request.method == 'POST':
        destination.delete()
        messages.success(request, 'Destination deleted successfully!')
        return redirect('read_destination')
    return render(request, 'delete_destination.html', {'destination': destination})