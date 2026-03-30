import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { plansService } from '../services/plans';
import { PlanDetail, LEVEL_LABELS } from '../types';
import {
  BookOpen, Clock, GraduationCap, Target, ArrowLeft, Download,
  Star, Trash2, ChevronDown, ChevronUp, CheckCircle, HelpCircle,
  Wrench, BookMarked, Lightbulb, Award, FileText, User
} from 'lucide-react';
import toast from 'react-hot-toast';

const Section = ({ title, icon: Icon, color = 'text-brand-400', children, defaultOpen = true }: {
  title: string; icon: React.ElementType; color?: string; children: React.ReactNode; defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card">
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between group"
      >
        <h3 className={`section-title ${color}`}>
          <Icon size={18} />
          {title}
        </h3>
        {open ? <ChevronUp size={16} className="text-surface-500" /> : <ChevronDown size={16} className="text-surface-500" />}
      </button>
      {open && <div className="mt-4 pt-4 border-t border-surface-700/50">{children}</div>}
    </div>
  );
};

const Prose = ({ text }: { text: string }) => (
  <p className="text-surface-300 text-sm leading-relaxed whitespace-pre-line">{text}</p>
);

export default function PlanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<PlanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    if (!id) return;
    plansService.getById(Number(id))
      .then(setPlan)
      .catch(() => { toast.error('Plan introuvable.'); navigate('/plans'); })
      .finally(() => setLoading(false));
  }, [id]);

  const handlePdf = async () => {
    if (!plan) return;
    setPdfLoading(true);
    try {
      await plansService.downloadPdf(plan.id, plan.generated_title || plan.theme);
      toast.success('PDF téléchargé !');
    } catch { toast.error('Erreur lors de la génération du PDF.'); }
    finally { setPdfLoading(false); }
  };

  const toggleFav = async () => {
    if (!plan) return;
    try {
      await plansService.toggleFavorite(plan.id, !plan.is_favorite);
      setPlan(p => p ? { ...p, is_favorite: !p.is_favorite } : p);
      toast.success(plan.is_favorite ? 'Retiré des favoris.' : 'Ajouté aux favoris !');
    } catch { toast.error('Erreur.'); }
  };

  const handleDelete = async () => {
    if (!plan || !confirm('Supprimer définitivement ce plan ?')) return;
    try {
      await plansService.delete(plan.id);
      toast.success('Plan supprimé.');
      navigate('/plans');
    } catch { toast.error('Erreur lors de la suppression.'); }
  };

  if (loading) return (
    <div className="max-w-3xl mx-auto space-y-4 animate-fade-in">
      {[1,2,3,4].map(i => <div key={i} className="h-32 rounded-2xl shimmer" />)}
    </div>
  );

  if (!plan) return null;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link to="/plans" className="flex items-center gap-2 text-surface-400 hover:text-white transition-colors text-sm">
          <ArrowLeft size={16} />Retour aux plans
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={toggleFav} className="p-2 rounded-xl bg-surface-800 border border-surface-700 hover:border-yellow-500/30 transition-all">
            <Star size={16} className={plan.is_favorite ? 'text-yellow-400 fill-yellow-400' : 'text-surface-400'} />
          </button>
          <button
            onClick={handlePdf}
            disabled={pdfLoading}
            className="btn-secondary py-2 text-sm"
          >
            {pdfLoading
              ? <div className="w-4 h-4 border-2 border-surface-400/30 border-t-surface-400 rounded-full animate-spin" />
              : <Download size={15} />}
            Imprimer en PDF
          </button>
          <button onClick={handleDelete} className="btn-danger py-2 text-sm">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Hero card */}
      <div className="bg-gradient-to-br from-brand-600/20 via-surface-800 to-surface-800 border border-brand-500/20 rounded-2xl p-6">
        <h1 className="font-display text-2xl font-bold text-white mb-4 leading-tight">{plan.generated_title}</h1>
        <div className="flex flex-wrap gap-3">
          {[
            { icon: BookOpen, label: plan.subject },
            { icon: GraduationCap, label: LEVEL_LABELS[plan.level] || plan.level },
            { icon: Clock, label: plan.duration },
            { icon: User, label: `${plan.author.first_name} ${plan.author.last_name}` },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-sm text-surface-300 bg-surface-700/50 px-3 py-1.5 rounded-lg border border-surface-600/50">
              <Icon size={13} className="text-brand-400" />{label}
            </div>
          ))}
          <div className="flex items-center gap-1.5 text-xs text-surface-400 ml-auto">
            <Clock size={12} />{new Date(plan.created_at).toLocaleDateString('fr-FR', { year:'numeric', month:'long', day:'numeric' })}
          </div>
        </div>
      </div>

      {/* Objectives */}
      <Section title="Objectifs Pédagogiques" icon={Target}>
        <Prose text={plan.generated_objectives} />
      </Section>

      {/* Prerequisites */}
      <Section title="Prérequis" icon={CheckCircle} color="text-emerald-400">
        <Prose text={plan.generated_prerequisites} />
      </Section>

      {/* Introduction */}
      <Section title="Introduction" icon={BookMarked} color="text-violet-400">
        <Prose text={plan.generated_introduction} />
      </Section>

      {/* Detailed plan */}
      <Section title="Plan Détaillé du Cours" icon={FileText}>
        <div className="space-y-4">
          {plan.generated_plan.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-500/15 border border-brand-500/25 rounded-lg flex items-center justify-center">
                <span className="text-brand-400 text-xs font-bold">{step.step}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-white text-sm">{step.title}</p>
                  <span className="badge bg-surface-700 text-surface-400 border border-surface-600 text-xs">
                    <Clock size={10} />{step.duration}
                  </span>
                </div>
                <p className="text-surface-300 text-sm leading-relaxed">{step.content}</p>
                {step.method && (
                  <p className="text-xs text-surface-500 mt-1 italic">Méthode : {step.method}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Activities */}
      <Section title="Activités Pédagogiques" icon={Lightbulb} color="text-amber-400">
        <div className="space-y-4">
          {plan.generated_activities.map((act, i) => (
            <div key={i} className="p-4 bg-surface-700/30 rounded-xl border border-surface-600/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-white text-sm">{act.title}</span>
                <span className="badge bg-amber-500/10 text-amber-400 border border-amber-500/20">{act.type}</span>
                <span className="badge bg-surface-700 text-surface-400 border border-surface-600 ml-auto">
                  <Clock size={10} />{act.duration}
                </span>
              </div>
              <p className="text-surface-300 text-sm leading-relaxed">{act.description}</p>
              {act.objective && (
                <p className="text-xs text-surface-400 mt-2 italic">Objectif : {act.objective}</p>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Materials */}
      {plan.generated_materials?.length > 0 && (
        <Section title="Matériel Pédagogique" icon={Wrench} color="text-cyan-400" defaultOpen={false}>
          <div className="grid sm:grid-cols-2 gap-3">
            {plan.generated_materials.map((mat, i) => (
              <div key={i} className="p-3 bg-surface-700/30 rounded-xl border border-surface-600/50">
                <p className="font-semibold text-white text-sm mb-1">{mat.name}</p>
                <span className="badge bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-2">{mat.type}</span>
                <p className="text-surface-400 text-xs leading-relaxed">{mat.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Conclusion */}
      <Section title="Conclusion" icon={CheckCircle} color="text-emerald-400">
        <Prose text={plan.generated_conclusion} />
      </Section>

      {/* ── EVALUATION ── */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-surface-800 to-surface-800 border border-emerald-500/20 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <Award size={20} className="text-emerald-400" />
          <h2 className="font-display text-xl font-bold text-white">Section Évaluation</h2>
        </div>
        <p className="text-surface-400 text-sm">Évaluation générée automatiquement par DAN</p>
      </div>

      {/* MCQ */}
      {plan.generated_mcq?.length > 0 && (
        <Section title={`QCM — ${plan.generated_mcq.length} questions`} icon={HelpCircle} color="text-blue-400">
          <div className="space-y-5">
            {plan.generated_mcq.map((q, i) => (
              <div key={i} className="p-4 bg-surface-700/30 rounded-xl border border-surface-600/50">
                <p className="font-semibold text-white text-sm mb-3">Q{i+1}. {q.question}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  {q.options.map((opt, j) => (
                    <div key={j} className={`px-3 py-2 rounded-lg text-sm border ${
                      showAnswers && opt.startsWith(q.correct)
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-surface-800 border-surface-600 text-surface-300'
                    }`}>
                      {opt}
                    </div>
                  ))}
                </div>
                {showAnswers && (
                  <p className="text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-3 py-2">
                    ✓ Réponse : {q.correct} — {q.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Open questions */}
      {plan.generated_open_questions?.length > 0 && (
        <Section title="Questions Ouvertes" icon={FileText} color="text-violet-400" defaultOpen={false}>
          <div className="space-y-4">
            {plan.generated_open_questions.map((q, i) => (
              <div key={i} className="p-4 bg-surface-700/30 rounded-xl border border-surface-600/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge bg-violet-500/10 text-violet-400 border border-violet-500/20">{q.points} pts</span>
                  <p className="font-semibold text-white text-sm">Q{i+1}. {q.question}</p>
                </div>
                {showAnswers && q.expected_elements && (
                  <p className="text-xs text-surface-400 italic bg-surface-800 rounded-lg px-3 py-2">
                    Éléments attendus : {q.expected_elements}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Practical exercise */}
      {plan.generated_practical_exercise && (
        <Section title="Exercice Pratique" icon={Wrench} color="text-orange-400" defaultOpen={false}>
          <Prose text={plan.generated_practical_exercise} />
        </Section>
      )}

      {/* Show/hide answers */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowAnswers(p => !p)}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
            showAnswers
              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
              : 'bg-surface-800 border-surface-700 text-surface-300 hover:border-emerald-500/30 hover:text-emerald-400'
          }`}
        >
          {showAnswers ? '🙈 Masquer le corrigé' : '👁 Afficher le corrigé'}
        </button>
      </div>

      {/* Answer key */}
      {showAnswers && plan.generated_answer_key && (
        <Section title="Corrigé Détaillé" icon={Award} color="text-emerald-400">
          <Prose text={plan.generated_answer_key} />
        </Section>
      )}

      {/* PDF CTA */}
      <div className="card border-brand-500/20 bg-brand-500/5 text-center py-6">
        <p className="text-surface-300 text-sm mb-4">Exportez ce plan complet en PDF pour l'imprimer ou le partager</p>
        <button onClick={handlePdf} disabled={pdfLoading} className="btn-primary mx-auto w-fit">
          {pdfLoading
            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Génération…</>
            : <><Download size={16} />Imprimer en PDF</>
          }
        </button>
      </div>
    </div>
  );
}
