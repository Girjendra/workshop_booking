from django.contrib import messages
from django.db.models import Q
from django.forms import inlineformset_factory, model_to_dict
from django.http import JsonResponse, Http404
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from workshop_app.models import Profile

try:
    from StringIO import StringIO as string_io
except ImportError:
    from io import BytesIO as string_io
from datetime import datetime
import os

from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.shortcuts import render, redirect
from django.utils import timezone

from .forms import (
    UserRegistrationForm, UserLoginForm,
    ProfileForm, WorkshopForm, CommentsForm, WorkshopTypeForm
)
from .models import (
    Profile, User,
    Workshop, Comment,
    WorkshopType, AttachmentFile
)
from .send_mails import send_email


__author__ = "Akshen Doke"
__credits__ = ["Mahesh Gudi", "Aditya P.", "Ankit Javalkar",
               "Prathamesh Salunke", "Kiran Kishore",
               "KhushalSingh Rajput", "Prabhu Ramachandran",
               "Arun KP"]


# Helper functions

def is_email_checked(user):
    return user.profile.is_email_verified


def is_instructor(user):
    """Check if the user is having instructor rights"""
    return user.groups.filter(name='instructor').exists()


def get_landing_page(user):
    # For now, landing pages of both instructor and coordinator are same
    if is_instructor(user):
        return reverse('workshop_app:workshop_status_instructor')
    return reverse('workshop_app:workshop_status_coordinator')


# View functions

def index(request):
    """Landing Page : Redirect to login page if not logged in
                      Redirect to respective landing page according to position"""
    user = request.user if request.user.is_authenticated else User.objects.first()
    if user.is_authenticated and is_email_checked(user):
        return redirect(get_landing_page(user))

    return redirect(reverse('workshop_app:login'))


# User views

# TODO: Forgot password workflow
def user_login(request):
    """User Login"""
    user = request.user if request.user.is_authenticated else User.objects.first()
    if user.is_superuser:
        return redirect('/admin')
    if user.is_authenticated:
        return redirect(get_landing_page(user))

    if request.method == "POST":
        form = UserLoginForm(request.POST)
        if form.is_valid():
            user = form.cleaned_data
            if user.profile.is_email_verified:
                login(request, user)
                return redirect(get_landing_page(user))
            else:
                return render(request, 'workshop_app/activation.html')
        else:
            return render(request, 'workshop_app/login.html', {"form": form})
    else:
        form = UserLoginForm()
        return render(request, 'workshop_app/login.html', {"form": form})


def user_logout(request):
    """Logout"""
    logout(request)
    return render(request, 'workshop_app/logout.html')


def activate_user(request, key=None):
    user = request.user if request.user.is_authenticated else User.objects.first()
    if user.is_superuser:
        return redirect("/admin")
    if key is None:
        if user.is_authenticated and not user.profile.is_email_verified and \
                timezone.now() > user.profile.key_expiry_time:
            status = "1"
            Profile.objects.get(user_id=user.profile.user_id).delete()
            User.objects.get(id=user.profile.user_id).delete()
            return render(request, 'workshop_app/activation.html',
                          {'status': status})
        elif user.is_authenticated and not user.profile.is_email_verified:
            return render(request, 'workshop_app/activation.html')
        elif user.is_authenticated and user.profile.is_email_verified:
            status = "2"
            return render(request, 'workshop_app/activation.html',
                          {'status': status})
        else:
            return redirect(reverse("workshop_app:register"))

    user = Profile.objects.filter(activation_key=key)
    if user.exists():
        user = user.first()
    else:
        logout(request)
        return redirect(reverse("workshop_app:register"))

    user.is_email_verified = True
    user.save()
    status = "0"
    return render(request, 'workshop_app/activation.html',
                  {"status": status})


def user_register(request):
    """User Registration form"""
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            username, password, key = form.save()
            new_user = authenticate(username=username, password=password)
            login(request, new_user)
            user_position = request.user.profile.position
            send_email(
                request, call_on='Registration',
                user_position=user_position,
                key=key
            )
            return render(request, 'workshop_app/activation.html')
        else:
            if request.user.is_authenticated:
                return redirect('workshop:view_profile')
            return render(
                request, "workshop_app/register.html",
                {"form": form}
            )
    else:
        if request.user.is_authenticated and is_email_checked(request.user):
            return redirect(get_landing_page(request.user))
        elif request.user.is_authenticated:
            return render(request, 'workshop_app/activation.html')
        form = UserRegistrationForm()
    return render(request, "workshop_app/register.html", {"form": form})


# Workshop views

@login_required
def workshop_status_coordinator(request):
    """ Workshops proposed by Coordinator """
    user = request.user if request.user.is_authenticated else User.objects.first()
    if is_instructor(user):
        return redirect(get_landing_page(user))
    workshops = Workshop.objects.filter(
        coordinator=user.id
    ).order_by('-date')
    return render(request, 'workshop_app/workshop_status_coordinator.html',
                  {"workshops": workshops})


@login_required
def workshop_status_instructor(request):
    """ Workshops to accept and accepted by Instructor """
    user = request.user if request.user.is_authenticated else User.objects.first()
    if not is_instructor(user):
        return redirect(get_landing_page(user))
    today = timezone.now().date()
    workshops = Workshop.objects.filter(Q(
        instructor=user.id,
        date__gte=today,
    ) | Q(status=0)).order_by('-date')

    return render(request, 'workshop_app/workshop_status_instructor.html',
                  {"workshops": workshops,
                   "today": today})


@login_required
def accept_workshop(request, workshop_id):
    user = request.user if request.user.is_authenticated else User.objects.first()
    if not is_instructor(user):
        return redirect(get_landing_page(user))
    workshop = Workshop.objects.get(id=workshop_id)
    # Change Status of the selected workshop
    workshop.status = 1
    workshop.instructor = user
    workshop.save()
    messages.add_message(request, messages.SUCCESS, "Workshop accepted!")

    coordinator_profile = workshop.coordinator.profile

    # For Instructor
    send_email(request, call_on='Booking Confirmed',
               user_position='instructor',
               workshop_date=str(workshop.date),
               workshop_title=workshop.workshop_type.name,
               user_name=workshop.coordinator.get_full_name(),
               other_email=workshop.coordinator.email,
               phone_number=coordinator_profile.phone_number,
               institute=coordinator_profile.institute
               )

    # For Coordinator
    send_email(request, call_on='Booking Confirmed',
               workshop_date=str(workshop.date),
               workshop_title=workshop.workshop_type.name,
               other_email=workshop.coordinator.email,
               phone_number=request.user.profile.phone_number
               )
    return redirect(reverse('workshop_app:workshop_status_instructor'))


@login_required
def change_workshop_date(request, workshop_id):
    user = request.user if request.user.is_authenticated else User.objects.first()
    if not is_instructor(user):
        return redirect(get_landing_page(user))
    if request.method == 'POST':
        new_workshop_date = datetime.strptime(
            request.POST.get('new_date'), "%Y-%m-%d"
        )
        today = datetime.today()
        if today <= new_workshop_date:
            workshop = Workshop.objects.filter(id=workshop_id)
            workshop_date = workshop.first().date
            workshop.update(date=new_workshop_date)
            messages.add_message(request, messages.INFO, "Workshop date updated")

            # For Instructor
            send_email(request, call_on='Change Date',
                       user_position='instructor',
                       workshop_date=str(workshop_date),
                       new_workshop_date=str(new_workshop_date.date())
                       )

            # For Coordinator
            send_email(request, call_on='Change Date',
                       new_workshop_date=str(new_workshop_date.date()),
                       workshop_date=str(workshop_date),
                       other_email=workshop.first().coordinator.email
                       )
    return redirect(reverse('workshop_app:workshop_status_instructor'))


@login_required
def propose_workshop(request):
    """Coordinator proposed a workshop and date"""

    user = request.user if request.user.is_authenticated else User.objects.first()
    if user.is_superuser:
        return redirect("/admin")
    if is_instructor(user):
        return redirect(get_landing_page(user))
    else:
        form = WorkshopForm()
        if request.method == 'POST':
            form = WorkshopForm(request.POST)
            if form.is_valid():
                form_data = form.save(commit=False)
                form_data.coordinator = user
                # Avoiding Duplicate workshop entries for same date and workshop_title
                if Workshop.objects.filter(
                        date=form_data.date,
                        workshop_type=form_data.workshop_type,
                        coordinator=form_data.coordinator
                ).exists():
                    return redirect(get_landing_page(user))
                else:
                    form_data.save()
                    instructors = Profile.objects.filter(position='instructor')
                    for i in instructors:
                        send_email(request, call_on='Proposed Workshop',
                                   user_position='instructor',
                                   workshop_date=str(form_data.date),
                                   workshop_title=form_data.workshop_type,
                                   user_name=user.get_full_name(),
                                   other_email=i.user.email,
                                   phone_number=user.profile.phone_number,
                                   institute=user.profile.institute
                                   )
                    messages.add_message(request, messages.SUCCESS, "Workshop proposed successfully")
                    return redirect(get_landing_page(user))
        # GET request
        return render(
            request, 'workshop_app/propose_workshop.html',
            {"form": form}
        )


@login_required
def workshop_type_details(request, workshop_type_id):
    """Gives the types of workshop details """
    user = request.user if request.user.is_authenticated else User.objects.first()
    if user.is_superuser:
        return redirect("/admin")

    workshop_type = WorkshopType.objects.filter(id=workshop_type_id)
    if workshop_type.exists():
        workshop_type = workshop_type.first()
    else:
        return redirect(reverse('workshop_app:workshop_type_list'))

    qs = AttachmentFile.objects.filter(workshop_type=workshop_type)
    AttachmentFileFormSet = inlineformset_factory(
        WorkshopType, AttachmentFile, fields=['attachments'],
        can_delete=False, extra=(qs.count() + 1)
    )

    if is_instructor(user):
        if request.method == 'POST':
            form = WorkshopTypeForm(request.POST, instance=workshop_type)
            form_file = AttachmentFileFormSet(
                request.POST, request.FILES, instance=form.instance
            )
            if form.is_valid():
                form_data = form.save()
                messages.add_message(
                    request, messages.SUCCESS, "Workshop type saved."
                )
                for file in form_file:
                    if (file.is_valid() and file.clean() and
                            file.clean()['attachments']):
                        if file.cleaned_data['id']:
                            file.cleaned_data['id'].delete()
                        file.save()
                        messages.add_message(
                            request, messages.INFO, "Attachment saved"
                        )
                return redirect(
                    reverse('workshop_app:workshop_type_details',
                            args=[form_data.id])
                    )
        else:
            form = WorkshopTypeForm(instance=workshop_type)
        form_file = AttachmentFileFormSet()
        for subform, data in zip(form_file, qs):
            subform.initial = model_to_dict(data)
        return render(
            request, 'workshop_app/edit_workshop_type.html',
            {'form': form, 'form_file': form_file}
        )

    return render(
        request, 'workshop_app/workshop_type_details.html',
        {'workshop_type': workshop_type}
    )


@login_required
def delete_attachment_file(request, file_id):
    if not is_instructor(request.user):
        return redirect(get_landing_page(request.user))
    file = AttachmentFile.objects.filter(id=file_id)
    if file.exists():
        file = file.first()
        if os.path.exists(file.attachments.path):
            os.remove(file.attachments.path)
        file.delete()
        messages.add_message(request, messages.INFO, "Attachment deleted")
        return redirect(
            reverse('workshop_app:workshop_type_details',
                    args=[file.workshop_type.id])
        )
    messages.add_message(request, messages.ERROR, "File does not exist")
    return redirect(reverse('workshop_app:workshop_type_list'))


@login_required
def workshop_type_tnc(request, workshop_type_id):
    workshop_type = WorkshopType.objects.filter(id=workshop_type_id)
    if workshop_type.exists():
        workshop_type = workshop_type.first()
        return JsonResponse({'tnc': workshop_type.terms_and_conditions})
    else:
        raise Http404


def workshop_type_list(request):
    """Gives the details for types of workshops."""
    user = request.user if request.user.is_authenticated else User.objects.first()
    if user.is_superuser:
        return redirect("/admin")

    workshop_types = WorkshopType.objects.get_queryset().order_by("id")

    paginator = Paginator(workshop_types, 12)  # Show upto 12 workshops per page
    page = request.GET.get('page')
    workshop_type = paginator.get_page(page)

    return render(request, 'workshop_app/workshop_type_list.html', {'workshop_type': workshop_type})


@login_required
def workshop_details(request, workshop_id):
    workshop = Workshop.objects.filter(id=workshop_id)
    if not workshop.exists():
        raise Http404
    workshop = workshop.first()
    if request.method == 'POST':
        form = CommentsForm(request.POST)
        if form.is_valid():
            form_data = form.save(commit=False)
            if not is_instructor(request.user):
                form_data.public = True
            form_data.author = request.user
            form_data.created_date = timezone.now()
            form_data.workshop = workshop
            form.save()
            messages.add_message(request, messages.SUCCESS, "Comment posted")
        else:
            messages.add_message(request, messages.ERROR, "Error posting comment")
    if is_instructor(request.user):
        workshop_comments = Comment.objects.filter(workshop=workshop)
    else:
        workshop_comments = Comment.objects.filter(workshop=workshop, public=True)
    return render(request, 'workshop_app/workshop_details.html',
                  {'workshop': workshop, 'workshop_comments': workshop_comments,
                   'form': CommentsForm(initial={'public': True})})


@login_required
def add_workshop_type(request):
    if not is_instructor(request.user):
        return redirect(get_landing_page(request.user))
    if request.method == 'POST':
        form = WorkshopTypeForm(request.POST)
        if form.is_valid():
            form_data = form.save()
            messages.add_message(request, messages.SUCCESS, "Workshop Type added")
            return redirect(
                reverse('workshop_app:workshop_type_details',
                        args=[form_data.id])
            )
    else:
        form = WorkshopTypeForm
    return render(request, 'workshop_app/add_workshop_type.html', {'form': form})


@login_required
def view_profile(request, user_id):
    """Instructor can view coordinator profile """
    user = request.user if request.user.is_authenticated else User.objects.first()
    if is_instructor(user) and is_email_checked(user):
        coordinator_profile = Profile.objects.get(user_id=user_id)
        workshops = Workshop.objects.filter(coordinator=user_id).order_by(
            'date')

        return render(request, "workshop_app/view_profile.html",
                      {"coordinator_profile": coordinator_profile,
                       "Workshops": workshops})
    return redirect(get_landing_page(user))


@login_required
def view_own_profile(request):
    """User can view own profile """
    user = request.user if request.user.is_authenticated else User.objects.first()
    if user.is_superuser:
        return redirect("admin")
    profile = user.profile
    if request.method == 'POST':
        form = ProfileForm(request.POST, user=user, instance=profile)
        if form.is_valid():
            form_data = form.save(commit=False)
            form_data.user = user
            form_data.user.first_name = request.POST['first_name']
            form_data.user.last_name = request.POST['last_name']
            form_data.user.save()
            form_data.save()
            messages.add_message(request, messages.SUCCESS, "Profile updated.")
            return redirect(reverse("workshop_app:view_own_profile"))
        else:
            messages.add_message(
                request, messages.ERROR, "Profile update failed!"
            )
    else:
        form = ProfileForm(user=user, instance=profile)

    return render(request, "workshop_app/view_profile.html",
                  {"profile": profile, "Workshops": None, "form": form})



from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Workshop
from .serializers import WorkshopSerializer

@api_view(['GET'])
def get_workshops(request):
    workshops = Workshop.objects.all()
    serializer = WorkshopSerializer(workshops, many=True)
    return Response(serializer.data)


from django.contrib.auth.models import User
from django.http import JsonResponse
import json

def register_api(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            username = data.get("username")
            email = data.get("email")
            password = data.get("password")

            # check if user exists
            if User.objects.filter(username=username).exists():
                return JsonResponse({"error": "User already exists"}, status=400)

            # create user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )

            return JsonResponse({"message": "User registered successfully"})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)   



import json
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

@csrf_exempt
def login_api(request):
    if request.method == "POST":
        data = json.loads(request.body)

        username = data.get("username")
        password = data.get("password")

        user = authenticate(username=username, password=password)

        if user is not None:
            return JsonResponse({"message": "Login successful"})
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=401)
        


from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from django.contrib.auth.models import User
from workshop_app.models import Profile

@csrf_exempt
def update_profile_api(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            username = data.get("username")

            user = User.objects.get(username=username)
            profile, created = Profile.objects.get_or_create(user=user)

            # user fields
            user.first_name = data.get("first_name", "")
            user.last_name = data.get("last_name", "")
            user.save()

            # profile fields
            profile.phone_number = data.get("phone", "")
            profile.institute = data.get("institute", "")
            profile.department = data.get("department", "")
            profile.location = data.get("location", "")
            profile.save()

            return JsonResponse({"message": "Profile updated successfully"})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)




from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Workshop
from .serializers import WorkshopSerializer

@api_view(['GET'])
def get_workshops(request):
    category = request.GET.get('category')
    price_type = request.GET.get('price')

    workshops = Workshop.objects.all()

    # 🔹 Filter by category
    if category:
        workshops = workshops.filter(workshop_type__name=category)

    # 🔹 Filter by price
    if price_type:
        if price_type == "free":
            workshops = workshops.filter(price=0)
        elif price_type == "paid":
            workshops = workshops.filter(price__gt=0)

    serializer = WorkshopSerializer(workshops, many=True)
    return Response(serializer.data)



def get_workshop_detail(request, id):
    try:
        w = Workshop.objects.get(id=id)

        data = {
            "id": w.id,
            "title": w.title,
            "description": w.description,
            "price": w.price,
            "date": w.date,

            # 🔥 ADD THESE
            "status": w.get_status(),
            "workshop_type": w.workshop_type.name,
            "coordinator": w.coordinator.username if w.coordinator else "N/A",
            "instructor": w.instructor.username if w.instructor else "Not Assigned",
            "tnc": w.tnc_accepted,
        }

        return JsonResponse(data)

    except Workshop.DoesNotExist:
        return JsonResponse({"error": "Not found"}, status=404)


from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Workshop
from .serializers import WorkshopSerializer

@api_view(['POST'])
def create_workshop(request):
    print("DATA:", request.data)   # 👈

    try:
        workshop = Workshop.objects.create(
            title=request.data.get("title"),
            description=request.data.get("description"),
            price=request.data.get("price"),
            date=request.data.get("date"),
            workshop_type_id=request.data.get("workshop_type") or 1,
            coordinator=User.objects.first(),
            status=0,
            tnc_accepted=True
        )

        print("CREATED:", workshop.id)  # 👈 SUCCESS

        return Response({"message": "Created"})

    except Exception as e:
        print("ERROR:", e)  # 👈 FAIL
        return Response({"error": str(e)})
    



from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Workshop


@api_view(['POST'])
def update_workshop_status(request, id):
    try:
        workshop = Workshop.objects.get(id=id)

        new_status = request.data.get("status")

        username = request.data.get("username")   # 👈 ADD THIS
        user = User.objects.get(username=username)

        # 🔥 ADMIN CHECK
        if not user.is_staff:
            return Response({"error": "Only admin can update status"}, status=403)

        if new_status not in [0, 1, 2]:
            return Response({"error": "Invalid status"})

        workshop.status = new_status
        workshop.save()

        return Response({"message": "Status updated successfully"})

    except Workshop.DoesNotExist:
        return Response({"error": "Workshop not found"})
    

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Workshop

@api_view(['GET'])
def workshop_stats(request):
    total = Workshop.objects.count()
    accepted = Workshop.objects.filter(status=1).count()
    pending = Workshop.objects.filter(status=0).count()
    rejected = Workshop.objects.filter(status=2).count()

    return Response({
        "total": total,
        "accepted": accepted,
        "pending": pending,
        "rejected": rejected
    })


from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def reset_password(request):
    return Response({"message": "Reset link sent"})


@api_view(['GET'])
def get_profile(request):
    user = request.user if request.user.is_authenticated else User.objects.first()

    try:
        profile = Profile.objects.get(user=user)

        data = {
            "first_name": profile.user.first_name,
            "last_name": profile.user.last_name,
            "phone": profile.phone_number,
            "institute": profile.institute,
            "department": profile.department,
            "location": profile.location,
        }

        return Response(data)

    except Profile.DoesNotExist:
        return Response({"message": "No profile"})