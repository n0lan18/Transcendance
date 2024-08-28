from django.shortcuts import render

# Create your views here.

from django.http import JsonResponse

def spa_view(request):
    return render(request, 'index.html')

def data_view(request):
    data = {
        "message": "Hello, world!"
    }
    return JsonResponse(data)