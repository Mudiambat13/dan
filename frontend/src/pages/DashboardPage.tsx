import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { plansService } from '../services/plans';
import { PlanListItem, LEVEL_LABELS } from '../types';
import { PlusCircle, BookOpen, Star, Clock, Sparkles, TrendingUp, ArrowRight, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<PlanListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    plansService.list()
      .then(setPlans)
      .catch(() => toast.error('Impossible de charger vos plans.'))
      .finally(() => setLoading(false));
  }, []);

  const favorites = plans.filter(p => p.is_favorite);
  const recent = plans.slice(0, 4);

  const stats = [
    { label: 'Plans créés', value: plans.length, icon: FileText, color: 'text-brand-400', bg: 'bg-brand-500/10 border-brand-500/20' },
    { label: 'Favoris', value: favorites.length, icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    { label: 'Ce mois', value: plans.filter(p => new Date(p.created_at).getMonth() === new Date().getMonth()).length, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Welcome */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-600/20 via-brand-500/10 to-surface-800 border border-brand-500/20 rounded-2xl p-6 lg:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-brand-400" />
            <span className="text-brand-400 text-sm font-semibold">Bonjour 👋</span>
          </div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-white mb-2">
            {user?.first_name} {user?.last_name}
          </h1>
          <p className="text-surface-300 text-sm mb-5 max-w-md">
            Prêt à créer un nouveau plan pédagogique ? DAN génère des cours complets avec évaluations en quelques secondes.
          </p>
          <Link to="/create" className="btn-primary w-fit">
            <PlusCircle size={18} />
            Créer un nouveau plan
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`card border ${bg} flex items-center gap-4`}>
            <div className={`p-2.5 rounded-xl ${bg} border ${bg}`}>
              <Icon size={20} className={color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{loading ? '—' : value}</p>
              <p className="text-xs text-surface-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent plans */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title"><BookOpen size={20} className="text-brand-400" />Plans récents</h2>
          <Link to="/plans" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
            Voir tout <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-3">
            {[1,2,3].map(i => <div key={i} className="h-20 rounded-2xl shimmer" />)}
          </div>
        ) : recent.length === 0 ? (
          <div className="card text-center py-12 border-dashed border-surface-600">
            <BookOpen size={40} className="mx-auto text-surface-600 mb-3" />
            <p className="text-surface-400 mb-4">Aucun plan pour l'instant</p>
            <Link to="/create" className="btn-primary w-fit mx-auto">
              <PlusCircle size={16} />Créer mon premier plan
            </Link>
          </div>
        ) : (
          <div className="grid gap-3">
            {recent.map(plan => (
              <Link
                key={plan.id}
                to={`/plans/${plan.id}`}
                className="card hover:border-brand-500/30 hover:bg-surface-700/50 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-brand-500/20 transition-colors">
                      <BookOpen size={18} className="text-brand-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{plan.generated_title || plan.theme}</p>
                      <p className="text-xs text-surface-400 mt-0.5">
                        {plan.subject} · {LEVEL_LABELS[plan.level] || plan.level}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                    {plan.is_favorite && <Star size={14} className="text-yellow-400 fill-yellow-400" />}
                    <div className="flex items-center gap-1 text-surface-500 text-xs">
                      <Clock size={12} />
                      {new Date(plan.created_at).toLocaleDateString('fr-FR')}
                    </div>
                    <ArrowRight size={14} className="text-surface-600 group-hover:text-brand-400 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
