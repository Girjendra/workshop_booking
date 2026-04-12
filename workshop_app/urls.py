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
from django.urls import path, re_path
from workshop_app import views
from workshop_app.views import get_workshops

app_name = "workshop_app"

urlpatterns = [
    path('', views.index, name='index'),

    path('register/', views.user_register, name="register"),

    re_path(r'^activate_user/(?P<key>.+)$', views.activate_user),
    path('activate_user/', views.activate_user),

    path('login/', views.user_login, name="login"),
    path('logout/', views.user_logout, name="logout"),

    path('status', views.workshop_status_coordinator,
         name='workshop_status_coordinator'),

    path('dashboard', views.workshop_status_instructor,
         name='workshop_status_instructor'),

    path('accept_workshop/<int:workshop_id>', views.accept_workshop,
         name='accept_workshop'),

    path('change_workshop_date/<int:workshop_id>',
         views.change_workshop_date, name='change_workshop_date'),

    path('details/<int:workshop_id>',
         views.workshop_details, name='workshop_details'),

    path('type_details/<int:workshop_type_id>',
         views.workshop_type_details, name='workshop_type_details'),

    path('type_tnc/<int:workshop_type_id>',
         views.workshop_type_tnc, name='workshop_type_tnc'),

    path('propose/', views.propose_workshop,
         name='propose_workshop'),

    path('add_workshop_type', views.add_workshop_type,
         name='add_workshop_type'),

    path('delete_attachment_file/<int:file_id>',
         views.delete_attachment_file, name='delete_attachment_file'),

    path('types/', views.workshop_type_list,
         name='workshop_type_list'),

    path('view_profile/', views.view_own_profile,
         name='view_own_profile'),

    path('view_profile/<int:user_id>',
         views.view_profile, name='view_profile'),
]

urlpatterns += [
    path('api/workshops/', get_workshops),
]