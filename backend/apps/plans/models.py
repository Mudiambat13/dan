from django.db import models
from apps.users.models import User

class PedagogicalPlan(models.Model):
    LEVEL_CHOICES = [
        ('maternelle', 'Maternelle'),
        ('primaire', 'Primaire (CP-CM2)'),
        ('college', 'Collège (6e-3e)'),
        ('lycee', 'Lycée (2nde-Terminale)'),
        ('superieur', 'Enseignement Supérieur'),
        ('formation', 'Formation Professionnelle'),
    ]

    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='plans')
    subject = models.CharField(max_length=200, verbose_name='Matière')
    level = models.CharField(max_length=50, choices=LEVEL_CHOICES, verbose_name='Niveau scolaire')
    theme = models.CharField(max_length=300, verbose_name='Thème du cours')
    duration = models.CharField(max_length=100, verbose_name='Durée')
    target_skills = models.TextField(verbose_name='Compétences visées')
    pedagogical_objectives = models.TextField(verbose_name='Objectifs pédagogiques')

    # Generated content
    generated_title = models.CharField(max_length=400, blank=True)
    generated_objectives = models.TextField(blank=True)
    generated_prerequisites = models.TextField(blank=True)
    generated_introduction = models.TextField(blank=True)
    generated_plan = models.JSONField(default=list, blank=True)
    generated_activities = models.JSONField(default=list, blank=True)
    generated_materials = models.JSONField(default=list, blank=True)
    generated_conclusion = models.TextField(blank=True)

    # Evaluation
    generated_mcq = models.JSONField(default=list, blank=True)
    generated_open_questions = models.JSONField(default=list, blank=True)
    generated_practical_exercise = models.TextField(blank=True)
    generated_answer_key = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_favorite = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Plan pédagogique'
        verbose_name_plural = 'Plans pédagogiques'

    def __str__(self):
        return f"{self.generated_title or self.theme} - {self.author.full_name}"
