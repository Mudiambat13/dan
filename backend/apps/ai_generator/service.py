import json
import os
import google.generativeai as genai
from django.conf import settings


def get_gemini_client():
    genai.configure(api_key=settings.GEMINI_API_KEY)
    return genai.GenerativeModel(settings.GEMINI_MODEL)


def generate_pedagogical_plan(subject: str, level: str, theme: str,
                               duration: str, target_skills: str,
                               pedagogical_objectives: str) -> dict:
    model = get_gemini_client()

    prompt = f"""Tu es Dan, un assistant pédagogique expert en ingénierie pédagogique.
Génère un plan pédagogique complet et détaillé en français pour les paramètres suivants :

- Matière : {subject}
- Niveau scolaire : {level}
- Thème du cours : {theme}
- Durée : {duration}
- Compétences visées : {target_skills}
- Objectifs pédagogiques : {pedagogical_objectives}

Réponds UNIQUEMENT avec un objet JSON valide (sans markdown, sans backticks) avec cette structure exacte :
{{
  "title": "Titre accrocheur du cours",
  "objectives": "Objectifs pédagogiques détaillés et reformulés (texte long)",
  "prerequisites": "Prérequis nécessaires pour suivre ce cours (texte)",
  "introduction": "Introduction engageante pour le cours (2-3 paragraphes)",
  "plan": [
    {{
      "step": 1,
      "title": "Titre de l'étape",
      "duration": "Durée",
      "content": "Contenu détaillé de l'étape",
      "method": "Méthode pédagogique utilisée"
    }}
  ],
  "activities": [
    {{
      "title": "Nom de l'activité",
      "type": "Type (travail de groupe, exercice individuel, etc.)",
      "duration": "Durée",
      "description": "Description détaillée",
      "objective": "Objectif de l'activité"
    }}
  ],
  "materials": [
    {{
      "name": "Nom du matériel",
      "type": "Type (numérique, physique, etc.)",
      "description": "Description et utilisation"
    }}
  ],
  "conclusion": "Conclusion du cours et synthèse des apprentissages (texte)"
}}

Génère un contenu riche, détaillé et professionnel. Le plan doit contenir au moins 4-6 étapes."""

    response = model.generate_content(prompt)
    text = response.text.strip()
    # Clean potential markdown fences
    if text.startswith('```'):
        text = text.split('```')[1]
        if text.startswith('json'):
            text = text[4:]
    return json.loads(text)


def generate_evaluation(subject: str, level: str, theme: str,
                         plan_content: dict) -> dict:
    model = get_gemini_client()

    prompt = f"""Tu es Dan, un assistant pédagogique expert.
Génère une évaluation complète en français pour :

- Matière : {subject}
- Niveau : {level}
- Thème : {theme}
- Contenu du cours : {json.dumps(plan_content, ensure_ascii=False)[:2000]}

Réponds UNIQUEMENT avec un objet JSON valide (sans markdown, sans backticks) :
{{
  "mcq": [
    {{
      "question": "Question",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correct": "A",
      "explanation": "Explication de la bonne réponse"
    }}
  ],
  "open_questions": [
    {{
      "question": "Question ouverte",
      "points": 4,
      "expected_elements": "Éléments attendus dans la réponse"
    }}
  ],
  "practical_exercise": "Description complète de l'exercice pratique avec consignes détaillées",
  "answer_key": "Corrigé détaillé complet incluant les réponses aux QCM, questions ouvertes et exercice pratique"
}}

Génère 7 questions QCM, 3 questions ouvertes, 1 exercice pratique riche."""

    response = model.generate_content(prompt)
    text = response.text.strip()
    if text.startswith('```'):
        text = text.split('```')[1]
        if text.startswith('json'):
            text = text[4:]
    return json.loads(text)
