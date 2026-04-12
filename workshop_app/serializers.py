from rest_framework import serializers
from .models import Workshop

class WorkshopSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source="workshop_type.name")

class WorkshopSerializer(serializers.ModelSerializer):
    workshop_type_name = serializers.CharField(source='workshop_type.name')

    class Meta:
        model = Workshop
        fields = ['id', 'title', 'description', 'price', 'date', 'workshop_type_name']