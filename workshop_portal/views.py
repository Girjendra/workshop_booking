# Django Imports
from django.shortcuts import redirect
from django.urls import reverse
from django.conf import settings

# Local Imports
from cms.models import Page


def index(request):
    page = Page.objects.filter(title=settings.HOME_PAGE_TITLE)
    if page.exists():
        redirect_url = reverse("cms:home", args=[page.first().permalink])
    else:
        redirect_url = reverse("workshop_app:index")
    return redirect(redirect_url)



from rest_framework.decorators import api_view
from rest_framework.response import Response
from workshop_app.models import Profile

@api_view(['GET'])
def get_profile(request):
    user = request.user

    try:
        profile = Profile.objects.get(user=user)

        data = {
            "first_name": profile.first_name,
            "last_name": profile.last_name,
            "phone": profile.phone,
            "institute": profile.institute,
            "department": profile.department,
            "location": profile.location,
        }

        return Response(data)

    except Profile.DoesNotExist:
        return Response({"message": "No profile"})