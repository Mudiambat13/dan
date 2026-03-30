from rest_framework import serializers
from .models import PedagogicalPlan
from apps.users.serializers import UserSerializer

class PlanCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PedagogicalPlan
        fields = ('subject', 'level', 'theme', 'duration', 'target_skills', 'pedagogical_objectives')

class PlanListSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = PedagogicalPlan
        fields = ('id', 'author', 'subject', 'level', 'theme', 'duration',
                  'generated_title', 'created_at', 'is_favorite')

class PlanDetailSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = PedagogicalPlan
        fields = '__all__'

class PlanUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PedagogicalPlan
        fields = ('is_favorite',)
