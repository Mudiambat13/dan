import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, User, School, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', username: '',
    school: '', password: '', password2: '', role: 'teacher',
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.password2) { toast.error('Les mots de passe ne correspondent pas.'); return; }
    setLoading(true);
    try {
      await register(form);
      toast.success('Compte créé ! Vous pouvez vous connecter.');
      navigate('/login');
    } catch (err: any) {
      const data = err.response?.data;
      const msg = data ? Object.values(data).flat().join(' ') : 'Erreur lors de la création du compte.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg animate-slide-up relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-500/15 rounded-2xl border border-brand-500/25 mb-4">
            <Sparkles size={26} className="text-brand-400" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">
            Rejoindre <span className="text-brand-400">DAN</span>
          </h1>
          <p className="text-surface-400 text-sm">Créez votre espace enseignant</p>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-6">Créer un compte</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Prénom</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500" />
                  <input type="text" required value={form.first_name} onChange={set('first_name')} placeholder="Marie" className="input-field pl-9" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Nom</label>
                <input type="text" required value={form.last_name} onChange={set('last_name')} placeholder="Dupont" className="input-field" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500" />
                <input type="email" required value={form.email} onChange={set('email')} placeholder="marie.dupont@ecole.fr" className="input-field pl-9" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Nom d'utilisateur</label>
              <input type="text" required value={form.username} onChange={set('username')} placeholder="marie_dupont" className="input-field" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">École / Établissement <span className="text-surface-600 normal-case font-normal">(optionnel)</span></label>
              <div className="relative">
                <School size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500" />
                <input type="text" value={form.school} onChange={set('school')} placeholder="Lycée Victor Hugo, Paris" className="input-field pl-9" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Rôle</label>
              <select value={form.role} onChange={set('role')} className="input-field">
                <option value="teacher">Enseignant</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Mot de passe</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500" />
                  <input type={showPwd ? 'text' : 'password'} required value={form.password} onChange={set('password')} placeholder="8+ caractères" className="input-field pl-9 pr-9" />
                  <button type="button" onClick={() => setShowPwd(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300">
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Confirmer</label>
                <input type={showPwd ? 'text' : 'password'} required value={form.password2} onChange={set('password2')} placeholder="••••••••" className="input-field" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Création...</>
              ) : (
                <>Créer mon compte <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-surface-400 mt-5">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
