from django.contrib import admin
from .models import PedagogicalPlan

@admin.register(PedagogicalPlan)
class PedagogicalPlanAdmin(admin.ModelAdmin):
    list_display = ('generated_title', 'author', 'subject', 'level', 'created_at')
    list_filter = ('level', 'subject', 'created_at')
    search_fields = ('generated_title', 'theme', 'author__email')
    readonly_fields = ('created_at', 'updated_at')
