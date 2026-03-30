import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { plansService } from '../services/plans';
import { PlanListItem, LEVEL_LABELS } from '../types';
import { BookOpen, Star, Clock, Trash2, Search, PlusCircle, ArrowRight, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PlansListPage() {
  const [plans, setPlans] = useState<PlanListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    plansService.list()
      .then(setPlans)
      .catch(() => toast.error('Impossible de charger les plans.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm('Supprimer ce plan ?')) return;
    setDeleting(id);
    try {
      await plansService.delete(id);
      setPlans(p => p.filter(plan => plan.id !== id));
      toast.success('Plan supprimé.');
    } catch {
      toast.error('Erreur lors de la suppression.');
    } finally {
      setDeleting(null);
    }
  };

  const toggleFav = async (id: number, val: boolean, e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await plansService.toggleFavorite(id, !val);
      setPlans(p => p.map(plan => plan.id === id ? { ...plan, is_favorite: !val } : plan));
    } catch { toast.error('Erreur.'); }
  };

  const filtered = plans.filter(p =>
    [p.generated_title, p.subject, p.theme, p.level]
      .some(f => f?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-white mb-1">Mes Plans</h1>
          <p className="text-surface-400 text-sm">{plans.length} plan{plans.length > 1 ? 's' : ''} pédagogique{plans.length > 1 ? 's' : ''}</p>
        </div>
        <Link to="/create" className="btn-primary w-fit flex-shrink-0">
          <PlusCircle size={16} />Nouveau plan
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par matière, thème, niveau…"
          className="input-field pl-10"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => <div key={i} className="h-24 rounded-2xl shimmer" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16 border-dashed border-surface-600">
          <FileText size={48} className="mx-auto text-surface-600 mb-3" />
          <p className="text-surface-400 font-medium mb-1">
            {search ? 'Aucun résultat pour cette recherche' : 'Aucun plan pédagogique'}
          </p>
          <p className="text-surface-500 text-sm mb-5">
            {search ? 'Essayez avec d\'autres mots-clés' : 'Créez votre premier plan avec DAN'}
          </p>
          {!search && (
            <Link to="/create" className="btn-primary w-fit mx-auto">
              <PlusCircle size={16} />Créer un plan
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(plan => (
            <Link
              key={plan.id}
              to={`/plans/${plan.id}`}
              className="card hover:border-brand-500/30 hover:bg-surface-700/30 transition-all duration-200 group block"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-brand-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-brand-500/20 transition-colors">
                  <BookOpen size={20} className="text-brand-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{plan.generated_title || plan.theme}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="badge bg-brand-500/10 text-brand-400 border border-brand-500/20">{plan.subject}</span>
                        <span className="badge bg-surface-700 text-surface-300 border border-surface-600">
                          {LEVEL_LABELS[plan.level] || plan.level}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-surface-500">
                          <Clock size={11} />{new Date(plan.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={e => toggleFav(plan.id, plan.is_favorite, e)}
                        className="p-1.5 rounded-lg hover:bg-yellow-500/10 transition-colors"
                        title={plan.is_favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      >
                        <Star size={15} className={plan.is_favorite ? 'text-yellow-400 fill-yellow-400' : 'text-surface-500'} />
                      </button>
                      <button
                        onClick={e => handleDelete(plan.id, e)}
                        disabled={deleting === plan.id}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-surface-500 hover:text-red-400 transition-colors"
                        title="Supprimer"
                      >
                        {deleting === plan.id
                          ? <div className="w-3.5 h-3.5 border border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                          : <Trash2 size={15} />}
                      </button>
                      <ArrowRight size={14} className="text-surface-600 group-hover:text-brand-400 transition-colors ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
