"""workshop_portal URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
# from django.conf.urls import url, include
from django.conf.urls.static import static
from django.contrib import admin
from workshop_portal import views
from django.conf import settings
from django.http import JsonResponse
from django.urls import path, include
from workshop_app.views import register_api, login_api, get_workshops
from workshop_app.views import update_profile_api, get_workshop_detail
from django.contrib import admin

def api_home(request):
    return JsonResponse({"message": "API running"})

urlpatterns = [
    # url(r'^admin/', admin.site.urls),
    path('workshop/', include('workshop_app.urls')),
    # url(r'^reset/', include('django.contrib.auth.urls')),
    # url(r'^page/', include('cms.urls')),
    # url(r'^statistics/', include('statistics_app.urls')),
    path('', api_home),
    path('api/register/', register_api),
    path('api/login/', login_api),
    path('api/workshops/', get_workshops),
    path('api/profile/update/', update_profile_api),
    path('api/workshops/<int:id>/', get_workshop_detail),
    path('admin/', admin.site.urls),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from workshop_app.views import update_profile_api

urlpatterns += [
    path('api/profile/update/', update_profile_api),
]