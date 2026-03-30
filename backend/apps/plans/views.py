import json
from django.http import HttpResponse
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import PedagogicalPlan
from .serializers import (PlanCreateSerializer, PlanListSerializer,
                           PlanDetailSerializer, PlanUpdateSerializer)
from apps.ai_generator.service import generate_pedagogical_plan, generate_evaluation
from apps.ai_generator.pdf_service import generate_plan_pdf


class GeneratePlanView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PlanCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        try:
            plan_content = generate_pedagogical_plan(
                subject=data['subject'],
                level=data['level'],
                theme=data['theme'],
                duration=data['duration'],
                target_skills=data['target_skills'],
                pedagogical_objectives=data['pedagogical_objectives'],
            )
            eval_content = generate_evaluation(
                subject=data['subject'],
                level=data['level'],
                theme=data['theme'],
                plan_content=plan_content,
            )

            plan = PedagogicalPlan.objects.create(
                author=request.user,
                subject=data['subject'],
                level=data['level'],
                theme=data['theme'],
                duration=data['duration'],
                target_skills=data['target_skills'],
                pedagogical_objectives=data['pedagogical_objectives'],
                generated_title=plan_content.get('title', ''),
                generated_objectives=plan_content.get('objectives', ''),
                generated_prerequisites=plan_content.get('prerequisites', ''),
                generated_introduction=plan_content.get('introduction', ''),
                generated_plan=plan_content.get('plan', []),
                generated_activities=plan_content.get('activities', []),
                generated_materials=plan_content.get('materials', []),
                generated_conclusion=plan_content.get('conclusion', ''),
                generated_mcq=eval_content.get('mcq', []),
                generated_open_questions=eval_content.get('open_questions', []),
                generated_practical_exercise=eval_content.get('practical_exercise', ''),
                generated_answer_key=eval_content.get('answer_key', ''),
            )
            return Response(PlanDetailSerializer(plan).data, status=status.HTTP_201_CREATED)

        except json.JSONDecodeError as e:
            return Response({'error': f'Erreur de parsing IA: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({'error': f'Erreur de génération: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PlanListView(generics.ListAPIView):
    serializer_class = PlanListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PedagogicalPlan.objects.filter(author=self.request.user)


class PlanDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PedagogicalPlan.objects.filter(author=self.request.user)

    def get_serializer_class(self):
        if self.request.method in ('PATCH', 'PUT'):
            return PlanUpdateSerializer
        return PlanDetailSerializer


class PlanPDFView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            plan = PedagogicalPlan.objects.get(pk=pk, author=request.user)
        except PedagogicalPlan.DoesNotExist:
            return Response({'error': 'Plan introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        pdf_bytes = generate_plan_pdf(plan)
        filename = f"plan_{pk}_{plan.subject.replace(' ', '_')}.pdf"
        response = HttpResponse(pdf_bytes, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response
