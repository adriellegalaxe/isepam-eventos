from django.shortcuts import render
from events.models import Event
from django.utils import timezone

# Create your views here.

def home(request):
    recent_events = Event.objects.filter(date__lt=timezone.now().date()).order_by('-date')[:3]
    available_events = Event.objects.filter(date__gte=timezone.now().date())
    context = {
        'recent_events': recent_events,
        'available_events': available_events,
    }
    return render(request, 'home.html', context)
