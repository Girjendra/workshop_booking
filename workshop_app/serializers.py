from rest_framework import serializers
from .models import Workshop

class WorkshopSerializer(serializers.ModelSerializer):
    workshop_type_name = serializers.CharField(source='workshop_type.name')
    status_display = serializers.CharField(source='get_status')

    class Meta:
        model = Workshop
        fields = [
            'id',
            'title',
            'description',
            'price',
            'date',
            'workshop_type_name',
            'status_display'
        ]