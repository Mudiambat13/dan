import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { plansService } from '../services/plans';
import { GeneratePlanInput } from '../types';
import { Sparkles, BookOpen, GraduationCap, Clock, Target, Lightbulb, Send, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const LEVELS = [
  { value: '', label: 'Sélectionner un niveau' },
  { value: 'maternelle', label: 'Maternelle' },
  { value: 'primaire', label: 'Primaire (CP–CM2)' },
  { value: 'college', label: 'Collège (6e–3e)' },
  { value: 'lycee', label: 'Lycée (2nde–Terminale)' },
  { value: 'superieur', label: 'Enseignement Supérieur' },
  { value: 'formation', label: 'Formation Professionnelle' },
];

const DURATIONS = ['30 minutes', '45 minutes', '1 heure', '1h30', '2 heures', '3 heures', '4 heures', '1 journée'];

const fields = [
  { key: 'subject', label: 'Matière', icon: BookOpen, placeholder: 'ex : Mathématiques, Histoire, SVT…', type: 'input' },
  { key: 'level', label: 'Niveau scolaire', icon: GraduationCap, type: 'select' },
  { key: 'theme', label: 'Thème du cours', icon: Lightbulb, placeholder: 'ex : Les fractions, La Révolution française…', type: 'input' },
  { key: 'duration', label: 'Durée', icon: Clock, type: 'duration' },
  { key: 'target_skills', label: 'Compétences visées', icon: Target, placeholder: 'Décrivez les compétences que les élèves doivent acquérir…', type: 'textarea' },
  { key: 'pedagogical_objectives', label: 'Objectifs pédagogiques', icon: Info, placeholder: 'Quels sont les objectifs d\'apprentissage de ce cours ?', type: 'textarea' },
];

export default function CreatePlanPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<GeneratePlanInput>({
    subject: '', level: '', theme: '', duration: '1 heure',
    target_skills: '', pedagogical_objectives: '',
  });

  const set = (k: keyof GeneratePlanInput) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.level) { toast.error('Veuillez sélectionner un niveau scolaire.'); return; }
    setLoading(true);
    const toastId = toast.loading('DAN génère votre plan pédagogique… ⏳', { duration: 60000 });
    try {
      const plan = await plansService.generate(form);
      toast.dismiss(toastId);
      toast.success('Plan généré avec succès ! 🎉');
      navigate(`/plans/${plan.id}`);
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error(err.response?.data?.error || 'Erreur lors de la génération.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-brand-500/10 rounded-lg border border-brand-500/20">
            <Sparkles size={18} className="text-brand-400" />
          </div>
          <span className="text-brand-400 text-sm font-semibold">Génération IA</span>
        </div>
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-white mb-2">Nouveau Plan Pédagogique</h1>
        <p className="text-surface-400 text-sm">
          Remplissez les informations ci-dessous. DAN générera automatiquement un plan complet avec évaluations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {fields.map(({ key, label, icon: Icon, placeholder, type }) => (
          <div key={key} className="card space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-white">
              <Icon size={16} className="text-brand-400" />
              {label}
            </label>

            {type === 'input' && (
              <input
                type="text"
                required
                value={form[key as keyof GeneratePlanInput]}
                onChange={set(key as keyof GeneratePlanInput)}
                placeholder={placeholder}
                className="input-field"
              />
            )}

            {type === 'textarea' && (
              <textarea
                required
                rows={3}
                value={form[key as keyof GeneratePlanInput]}
                onChange={set(key as keyof GeneratePlanInput)}
                placeholder={placeholder}
                className="input-field resize-none"
              />
            )}

            {type === 'select' && (
              <select
                required
                value={form.level}
                onChange={set('level')}
                className="input-field"
              >
                {LEVELS.map(l => (
                  <option key={l.value} value={l.value} disabled={!l.value}>{l.label}</option>
                ))}
              </select>
            )}

            {type === 'duration' && (
              <div className="flex flex-wrap gap-2">
                {DURATIONS.map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, duration: d }))}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      form.duration === d
                        ? 'bg-brand-500 text-white'
                        : 'bg-surface-700 text-surface-300 hover:bg-surface-600 border border-surface-600'
                    }`}
                  >
                    {d}
                  </button>
                ))}
                <input
                  type="text"
                  value={!DURATIONS.includes(form.duration) ? form.duration : ''}
                  onChange={set('duration')}
                  placeholder="Autre durée…"
                  className="input-field w-32 py-1.5 text-sm"
                />
              </div>
            )}
          </div>
        ))}

        {/* AI notice */}
        <div className="flex items-start gap-3 px-4 py-3 bg-brand-500/5 border border-brand-500/15 rounded-xl">
          <Sparkles size={16} className="text-brand-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-surface-400 leading-relaxed">
            <strong className="text-brand-400">DAN</strong> va générer : le plan complet, les activités, le matériel,
            et une évaluation avec QCM, questions ouvertes, exercice pratique et corrigé.
            La génération prend environ <strong className="text-surface-300">15–30 secondes</strong>.
          </p>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base">
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              DAN génère votre plan…
            </>
          ) : (
            <>
              <Send size={18} />
              Générer le plan pédagogique
            </>
          )}
        </button>
      </form>
    </div>
  );
}
