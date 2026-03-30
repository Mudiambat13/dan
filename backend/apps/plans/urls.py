from django.urls import path
from .views import GeneratePlanView, PlanListView, PlanDetailView, PlanPDFView

urlpatterns = [
    path('generate-plan/', GeneratePlanView.as_view(), name='generate-plan'),
    path('plans/', PlanListView.as_view(), name='plan-list'),
    path('plans/<int:pk>/', PlanDetailView.as_view(), name='plan-detail'),
    path('plans/<int:pk>/pdf/', PlanPDFView.as_view(), name='plan-pdf'),
]
