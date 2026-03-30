export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: 'teacher' | 'admin';
  school: string;
  created_at: string;
}

export interface PlanStep {
  step: number;
  title: string;
  duration: string;
  content: string;
  method: string;
}

export interface Activity {
  title: string;
  type: string;
  duration: string;
  description: string;
  objective: string;
}

export interface Material {
  name: string;
  type: string;
  description: string;
}

export interface MCQQuestion {
  question: string;
  options: string[];
  correct: string;
  explanation: string;
}

export interface OpenQuestion {
  question: string;
  points: number;
  expected_elements: string;
}

export interface PlanListItem {
  id: number;
  author: User;
  subject: string;
  level: string;
  theme: string;
  duration: string;
  generated_title: string;
  created_at: string;
  is_favorite: boolean;
}

export interface PlanDetail extends PlanListItem {
  target_skills: string;
  pedagogical_objectives: string;
  generated_objectives: string;
  generated_prerequisites: string;
  generated_introduction: string;
  generated_plan: PlanStep[];
  generated_activities: Activity[];
  generated_materials: Material[];
  generated_conclusion: string;
  generated_mcq: MCQQuestion[];
  generated_open_questions: OpenQuestion[];
  generated_practical_exercise: string;
  generated_answer_key: string;
  updated_at: string;
}

export interface GeneratePlanInput {
  subject: string;
  level: string;
  theme: string;
  duration: string;
  target_skills: string;
  pedagogical_objectives: string;
}

export const LEVEL_LABELS: Record<string, string> = {
  maternelle: 'Maternelle',
  primaire: 'Primaire (CP–CM2)',
  college: 'Collège (6e–3e)',
  lycee: 'Lycée (2nde–Terminale)',
  superieur: 'Enseignement Supérieur',
  formation: 'Formation Professionnelle',
};
