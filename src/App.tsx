import { useState, useEffect, useRef } from 'react';
import { Message } from './types';
import { currentUser, members, initialMessages, contributions, cagnotes, announcements, socialAids } from './mockData';

// =====================================================
// ICONS
// =====================================================
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const ChatIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);
const WalletIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);
const ChartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);
const HeartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);
const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);
const DBIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
  </svg>
);
const LockIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const formatFCFA = (amount: number) => {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
};

// =====================================================
// LOGO LYBOK
// =====================================================
function LybokLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
  };
  return (
    <div className={`${sizes[size]} bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-amber-500/30 tracking-tighter`}>
      LB
    </div>
  );
}

// =====================================================
// PAGE DE CONNEXION
// =====================================================
function LoginPage({ onLogin }: { onLogin: (user: typeof currentUser) => void }) {
  const [email, setEmail] = useState('amadou.diallo@email.com');
  const [password, setPassword] = useState('demo1234');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onLogin(currentUser);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center p-4">
      {/* Particules décoratives */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo & titre */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-2xl shadow-amber-500/30 tracking-tighter">
              LB
            </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Ly<span className="text-amber-400">bok</span>
          </h1>
          <p className="text-emerald-300 mt-2 text-lg">Tontine des Anciens Élèves</p>
          <p className="text-slate-400 mt-1 text-sm">Plateforme de solidarité & d'entraide</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleLogin} className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
          <div className="flex items-center gap-2 mb-6 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-emerald-300 text-sm">Base de données <strong>lybok</strong> — SQL Server connecté</span>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Adresse email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                placeholder="votre@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3.5 rounded-xl font-bold text-lg hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25"
            >
              {isLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Connexion à lybok...
                </>
              ) : (
                <>
                  <LockIcon /> Se connecter
                </>
              )}
            </button>
          </div>
        </form>

        {/* Info SQL */}
        <div className="mt-6 bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
          <div className="flex items-start gap-3">
            <div className="text-amber-400 mt-0.5"><DBIcon /></div>
            <div>
              <p className="text-slate-300 text-sm font-medium">SQL Server — lybok</p>
              <p className="text-slate-500 text-xs mt-1">
                Serveur: DESKTOP-FABINHO\SAGEX3 • Tables: 7 • Version: 15.0.2165
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          © 2024 Lybok — Association des Anciens Élèves
        </p>
      </div>
    </div>
  );
}

// =====================================================
// NAVIGATION
// =====================================================
function Navigation({ currentPage, setCurrentPage, user, onLogout }: {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  user: typeof currentUser;
  onLogout: () => void;
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navItems = [
    { id: 'home', label: 'Accueil', icon: <HomeIcon /> },
    { id: 'chat', label: 'Chat', icon: <ChatIcon /> },
    { id: 'subscribe', label: 'Cagnote', icon: <WalletIcon /> },
    { id: 'dashboard', label: 'Tableau de bord', icon: <ChartIcon /> },
    { id: 'aids', label: 'Aides', icon: <HeartIcon /> },
    { id: 'members', label: 'Membres', icon: <UsersIcon /> },
  ];

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <LybokLogo />
            <div>
              <h1 className="font-black text-lg leading-tight tracking-tight">
                Ly<span className="text-amber-400">bok</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Tontine solidaire</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all text-sm ${
                  currentPage === item.id
                    ? 'bg-amber-500/20 text-amber-400 font-semibold'
                    : 'hover:bg-white/5 text-slate-300 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* User */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-all"
            >
              <span className="text-xl">{user.avatar}</span>
              <span className="hidden md:block text-sm text-slate-300">{user.name.split(' ')[0]}</span>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                  <span className="inline-block mt-1 text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-medium">
                    {user.role === 'admin' ? '👑 Administrateur' : '👤 Membre'}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Déconnexion
                </button>
              </div>
            )}
          </div>

          {/* Mobile Nav */}
          <div className="lg:hidden flex items-center space-x-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`p-2 rounded-lg transition-all ${
                  currentPage === item.id
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'hover:bg-white/5 text-slate-400'
                }`}
                title={item.label}
              >
                {item.icon}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

// =====================================================
// PAGE D'ACCUEIL
// =====================================================
function HomePage({ setCurrentPage }: { setCurrentPage: (page: string) => void }) {
  const paidThisMonth = contributions.filter(c => c.month === 'Janvier' && c.year === 2024 && c.status === 'paid').length;
  const currentCagnot = cagnotes.find(c => c.status === 'active');

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA4KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-50"></div>
        <div className="relative z-10 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-xl font-black text-white shadow-lg">LB</div>
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">Base lybok connectée ✓</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">
            Bienvenue sur <span className="text-amber-300">Lybok</span> ! 🤝
          </h2>
          <p className="text-lg md:text-xl text-emerald-100 mb-6 max-w-2xl">
            Notre plateforme de tontine solidaire pour soutenir les anciens élèves dans les moments difficiles et financer des projets sociaux.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setCurrentPage('subscribe')}
              className="bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-all shadow-lg"
            >
              💰 Cotiser maintenant
            </button>
            <button
              onClick={() => setCurrentPage('aids')}
              className="bg-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20 backdrop-blur-sm"
            >
              ❤️ Voir nos actions
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Membres</p>
              <p className="text-3xl font-black text-gray-800 mt-1">{members.length}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl">👥</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Cotisations</p>
              <p className="text-3xl font-black text-emerald-600 mt-1">{paidThisMonth}/{members.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">✅</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Collecté</p>
              <p className="text-2xl font-black text-blue-600 mt-1">{currentCagnot ? formatFCFA(currentCagnot.collectedAmount) : '0'}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl">💵</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Aides</p>
              <p className="text-2xl font-black text-rose-600 mt-1">{formatFCFA(180000)}</p>
            </div>
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-2xl">❤️</div>
          </div>
        </div>
      </div>

      {/* Cagnote Progress */}
      <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800">📊 Cagnote en cours</h3>
            <p className="text-sm text-gray-400">Janvier 2024 — Objectif: {formatFCFA(currentCagnot?.targetAmount || 0)}</p>
          </div>
          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold animate-pulse">● Active</span>
        </div>
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Progression</span>
            <span className="font-bold text-emerald-600">
              {currentCagnot ? Math.round((currentCagnot.collectedAmount / currentCagnot.targetAmount) * 100) : 0}%
            </span>
          </div>
          <div className="h-5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-1000 relative"
              style={{ width: `${currentCagnot ? (currentCagnot.collectedAmount / currentCagnot.targetAmount) * 100 : 0}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
            </div>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-500 font-medium">{formatFCFA(currentCagnot?.collectedAmount || 0)}</span>
            <span className="text-gray-400">{formatFCFA(currentCagnot?.targetAmount || 0)}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="bg-emerald-50 rounded-xl p-4">
            <p className="text-2xl font-black text-emerald-600">{paidThisMonth}</p>
            <p className="text-xs text-gray-500 mt-1">Ayant cotisé</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4">
            <p className="text-2xl font-black text-orange-600">{members.length - paidThisMonth}</p>
            <p className="text-xs text-gray-500 mt-1">En attente</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-2xl font-black text-blue-600">25 000</p>
            <p className="text-xs text-gray-500 mt-1">FCFA / mois</p>
          </div>
          <div className="bg-rose-50 rounded-xl p-4">
            <p className="text-2xl font-black text-rose-600">25</p>
            <p className="text-xs text-gray-500 mt-1">Jours restants</p>
          </div>
        </div>
      </section>

      {/* Annonces */}
      <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">📢 Annonces récentes</h3>
        <div className="space-y-4">
          {announcements.map(ann => (
            <div
              key={ann.id}
              className={`p-4 rounded-xl border-l-4 ${
                ann.priority === 'urgent'
                  ? 'bg-red-50 border-red-500'
                  : ann.priority === 'important'
                  ? 'bg-amber-50 border-amber-500'
                  : 'bg-blue-50 border-blue-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800">{ann.title}</h4>
                  <p className="text-gray-600 mt-1 text-sm">{ann.content}</p>
                  <p className="text-xs text-gray-400 mt-2">Par {ann.author} • {ann.date}</p>
                </div>
                {ann.priority === 'urgent' && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">Urgent</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tables lybok */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 md:p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-amber-400"><DBIcon /></div>
            <div>
              <h3 className="text-lg font-bold">Base de données <span className="text-amber-400">lybok</span></h3>
              <p className="text-xs text-slate-400">SQL Server 15.0.2165 — DESKTOP-FABINHO\SAGEX3</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-emerald-400 text-xs font-medium">Connecté</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { table: 'dbo.membres', rows: 10, icon: '👥' },
            { table: 'dbo.cagnottes', rows: 3, icon: '💰' },
            { table: 'dbo.cotisations', rows: 16, icon: '💵' },
            { table: 'dbo.contributions', rows: 24, icon: '📝' },
            { table: 'dbo.messages', rows: 10, icon: '💬' },
            { table: 'dbo.actualites', rows: 5, icon: '📰' },
            { table: 'dbo.announcements', rows: 5, icon: '📢' },
            { table: 'dbo.likes_actualites', rows: 0, icon: '👍' },
            { table: 'dbo.notifications', rows: 5, icon: '🔔' },
            { table: 'dbo.members', rows: 10, icon: '🔗' },
          ].map(t => (
            <div key={t.table} className="bg-white/5 rounded-xl p-3 border border-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <span>{t.icon}</span>
                <span className="text-[11px] text-slate-300 font-mono truncate">{t.table}</span>
              </div>
              <p className="text-lg font-bold text-amber-400">{t.rows} <span className="text-xs text-slate-400 font-normal">lignes</span></p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// =====================================================
// CHAT
// =====================================================
function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const message: Message = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      content: newMessage,
      timestamp: new Date(),
      type: 'message'
    };
    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-lg">💬</div>
            <div>
              <h3 className="font-bold">Discussion du groupe</h3>
              <p className="text-xs text-slate-400">{members.length} membres • SELECT * FROM lybok.dbo.messages</p>
            </div>
          </div>
          <div className="flex -space-x-2">
            {members.slice(0, 5).map((member, idx) => (
              <div key={member.id} className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-sm border-2 border-slate-800" style={{ zIndex: 10 - idx }}>
                {member.avatar}
              </div>
            ))}
            <div className="w-8 h-8 bg-amber-500/30 rounded-full flex items-center justify-center text-xs border-2 border-slate-800 text-amber-400 font-bold">+{members.length - 5}</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 h-[calc(100vh-18rem)]">
        {messages.map(msg => {
          const isCurrentUser = msg.userId === currentUser.id;
          const member = members.find(m => m.id === msg.userId);
          if (msg.type === 'info') {
            return (
              <div key={msg.id} className="flex justify-center">
                <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-xs font-medium max-w-md text-center">
                  {msg.content}
                </div>
              </div>
            );
          }
          return (
            <div key={msg.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-end space-x-2 max-w-[75%] ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {!isCurrentUser && (
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-sm flex-shrink-0">{member?.avatar}</div>
                )}
                <div>
                  {!isCurrentUser && <p className="text-xs text-gray-400 mb-1 ml-1 font-medium">{msg.userName}</p>}
                  <div className={`px-4 py-3 rounded-2xl ${
                    isCurrentUser
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-br-md'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <p className={`text-[10px] text-gray-400 mt-1 ${isCurrentUser ? 'text-right mr-1' : 'ml-1'}`}>
                    {msg.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center space-x-3">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Écrivez votre message..."
            className="flex-1 px-4 py-3 bg-gray-100 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// PAGE COTISATION
// =====================================================
function SubscribePage() {
  const [selectedAmount, setSelectedAmount] = useState(25000);
  const [paymentMethod, setPaymentMethod] = useState('orange');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const amounts = [10000, 15000, 20000, 25000, 30000, 50000];

  const handleSubscribe = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">✅</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Paiement enregistré !</h3>
            <p className="text-gray-500 mb-2">Votre cotisation de <strong className="text-emerald-600">{formatFCFA(selectedAmount)}</strong> a été enregistrée.</p>
            <p className="text-xs text-gray-400 mb-6 font-mono bg-gray-50 p-2 rounded-lg">
              INSERT INTO lybok.dbo.cotisations ✓
            </p>
            <button onClick={() => setShowSuccess(false)} className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-emerald-700">
              Fermer
            </button>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-emerald-600 to-teal-500 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">💰 Cotisation Mensuelle</h2>
        <p className="text-emerald-100 text-sm">Contribuez à la cagnote solidaire — lybok.dbo.cotisations</p>
      </div>

      {/* Montant */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Montant de la cotisation</h3>
        <div className="grid grid-cols-3 gap-3">
          {amounts.map(amount => (
            <button
              key={amount}
              onClick={() => setSelectedAmount(amount)}
              className={`py-4 px-3 rounded-xl font-bold transition-all ${
                selectedAmount === amount
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {formatFCFA(amount)}
            </button>
          ))}
        </div>
      </div>

      {/* Paiement */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Mode de paiement</h3>
        <div className="space-y-3">
          {[
            { id: 'orange', name: 'Orange Money', color: 'orange', icon: '📱' },
            { id: 'mtn', name: 'MTN Mobile Money', color: 'yellow', icon: '📱' },
            { id: 'wave', name: 'Wave', color: 'blue', icon: '🌊' },
          ].map(pm => (
            <button
              key={pm.id}
              onClick={() => setPaymentMethod(pm.id)}
              className={`w-full flex items-center p-4 rounded-xl transition-all ${
                paymentMethod === pm.id
                  ? `bg-${pm.color}-100 border-2 border-${pm.color}-500`
                  : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
              }`}
            >
              <div className={`w-12 h-12 bg-${pm.color}-500 rounded-xl flex items-center justify-center text-white text-2xl mr-4`}>
                {pm.icon}
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">{pm.name}</p>
                <p className="text-sm text-gray-500">Paiement mobile</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Téléphone */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Numéro de téléphone</h3>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+224</span>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="6XX XX XX XX"
            className="w-full pl-20 pr-4 py-4 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-lg"
          />
        </div>
      </div>

      {/* Récap */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Récapitulatif</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Mois</span><span className="font-medium">Janvier 2024</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Montant</span><span className="font-bold text-emerald-600 text-lg">{formatFCFA(selectedAmount)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Mode</span><span className="font-medium capitalize">{paymentMethod}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Base de données</span><span className="font-mono text-xs text-amber-600">lybok.dbo.cotisations</span></div>
          <div className="border-t pt-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-800">Total</span>
              <span className="text-2xl font-black text-emerald-600">{formatFCFA(selectedAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubscribe}
        disabled={!phoneNumber}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/25"
      >
        💳 Procéder au paiement
      </button>
    </div>
  );
}

// =====================================================
// TABLEAU DE BORD
// =====================================================
function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState('Janvier');
  const userContributions = contributions.filter(c => c.userId === currentUser.id);
  const totalPaid = userContributions.reduce((sum, c) => sum + (c.status === 'paid' ? c.amount : 0), 0);
  const monthContributions = contributions.filter(c => c.month === selectedMonth && c.year === 2024);

  return (
    <div className="space-y-6">
      {/* Profil */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center text-4xl">{currentUser.avatar}</div>
          <div>
            <h2 className="text-2xl font-bold">{currentUser.name}</h2>
            <p className="text-slate-400 text-sm">{currentUser.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full font-medium">👑 Admin</span>
              <span className="text-slate-500 text-xs">• Membre depuis {currentUser.joinDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats perso */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <p className="text-gray-400 text-xs font-medium uppercase">Mes cotisations</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{userContributions.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <p className="text-gray-400 text-xs font-medium uppercase">Total versé</p>
          <p className="text-xl font-black text-blue-600 mt-1">{formatFCFA(totalPaid)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <p className="text-gray-400 text-xs font-medium uppercase">Statut</p>
          <p className="text-lg font-bold text-emerald-600 mt-1">✅ À jour</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <p className="text-gray-400 text-xs font-medium uppercase">Rang</p>
          <p className="text-2xl font-black text-purple-600 mt-1">#3</p>
        </div>
      </div>

      {/* Tableau des cotisations */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800">📊 Cotisations du mois</h3>
            <p className="text-xs text-gray-400 font-mono mt-1">SELECT * FROM lybok.dbo.cotisations</p>
          </div>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="Janvier">Janvier 2024</option>
            <option value="Décembre">Décembre 2023</option>
            <option value="Novembre">Novembre 2023</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-xs uppercase tracking-wide">Membre</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-xs uppercase tracking-wide">Montant</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-xs uppercase tracking-wide">Date</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-xs uppercase tracking-wide">Statut</th>
              </tr>
            </thead>
            <tbody>
              {monthContributions.map(contrib => (
                <tr key={contrib.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{members.find(m => m.id === contrib.userId)?.avatar}</span>
                      <span className="font-medium text-gray-800 text-sm">{contrib.userName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-bold text-gray-800 text-sm">{formatFCFA(contrib.amount)}</td>
                  <td className="py-4 px-4 text-gray-500 text-sm">{contrib.paymentDate || '—'}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      contrib.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-700'
                        : contrib.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {contrib.status === 'paid' ? '✅ Payé' : contrib.status === 'pending' ? '⏳ En attente' : '⚠️ En retard'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historique perso */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">📋 Mon historique</h3>
        <div className="space-y-3">
          {userContributions.map(contrib => (
            <div key={contrib.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-lg">💰</div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{contrib.month} {contrib.year}</p>
                  <p className="text-xs text-gray-400">{contrib.paymentDate ? `Payé le ${contrib.paymentDate}` : 'En attente'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-emerald-600">{formatFCFA(contrib.amount)}</p>
                <p className={`text-xs ${contrib.status === 'paid' ? 'text-emerald-500' : 'text-orange-500'}`}>
                  {contrib.status === 'paid' ? '✅ Payé' : '⏳ En attente'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =====================================================
// PAGE AIDES SOCIALES
// =====================================================
function AidsPage() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => { setSubmitted(true); setTimeout(() => { setSubmitted(false); setShowForm(false); }, 3000); };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">❤️ Aides Sociales</h2>
        <p className="text-rose-100 text-sm">L'entraide au cœur de Lybok — lybok.dbo.actualites</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: '💰', value: formatFCFA(180000), label: 'Total distribué', color: 'rose' },
          { icon: '👥', value: '12', label: 'Bénéficiaires', color: 'blue' },
          { icon: '📚', value: '5', label: 'Étudiants soutenus', color: 'emerald' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
            <div className={`w-14 h-14 bg-${s.color}-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-2xl`}>{s.icon}</div>
            <p className={`text-2xl font-black text-${s.color}-600`}>{s.value}</p>
            <p className="text-gray-500 text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">📋 Aides versées</h3>
        <div className="space-y-3">
          {socialAids.map(aid => (
            <div key={aid.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-xl">❤️</div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{aid.beneficiary}</p>
                  <p className="text-xs text-gray-500">{aid.reason}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-rose-600">{formatFCFA(aid.amount)}</p>
                <p className="text-xs text-gray-400">{aid.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">📝 Demander une aide</h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-rose-600 hover:to-pink-600 transition-all"
          >
            {showForm ? '✕ Fermer' : '+ Nouvelle demande'}
          </button>
        </div>
        {submitted && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4 text-center">
            <p className="text-emerald-700 font-semibold">✅ Demande soumise avec succès !</p>
            <p className="text-xs text-emerald-500 font-mono mt-1">INSERT INTO lybok.dbo.actualites ✓</p>
          </div>
        )}
        {showForm && !submitted && (
          <div className="space-y-4 animate-in">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Motif</label>
              <select className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500">
                <option>Frais médicaux</option>
                <option>Frais de scolarité</option>
                <option>Urgence familiale</option>
                <option>Aide alimentaire</option>
                <option>Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea placeholder="Décrivez votre situation..." className="w-full px-4 py-3 bg-gray-100 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-rose-500" rows={4} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Montant demandé (FCFA)</label>
              <input type="number" placeholder="Ex: 50000" className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500" />
            </div>
            <button onClick={handleSubmit} className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-rose-600 hover:to-pink-600 transition-all">
              📨 Soumettre la demande
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================
// PAGE MEMBRES
// =====================================================
function MembersPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    avatar: '👨🏿‍💼',
    role: 'membre'
  });
  const [isSubmitting, setIsLoading] = useState(false);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      alert(`Membre ${newMember.prenom} ${newMember.nom} ajouté avec succès !`);
      setIsLoading(false);
      setShowAddForm(false);
      setNewMember({ nom: '', prenom: '', email: '', telephone: '', avatar: '👨🏿‍💼', role: 'membre' });
    }, 1500);
  };

  return (
    <div className="space-y-6 text-white">
      {/* En-tête adapté à votre design sombre */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            Membres
            <span className="text-xs font-mono bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">lybok.dbo.membres</span>
          </h2>
          <p className="text-slate-400 mt-1">Annuaire des membres de l'association</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-6 py-2.5 rounded-xl font-black transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
        >
          {showAddForm ? '✕ Fermer' : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              NOUVEAU MEMBRE
            </>
          )}
        </button>
      </div>

      {/* Formulaire stylisé pour votre thème sombre */}
      {showAddForm && (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 text-2xl shadow-inner">👤</div>
            <div>
              <h3 className="text-xl font-bold text-white">Ajouter un nouveau membre</h3>
              <p className="text-slate-400 text-sm">Enregistrement direct dans SQL Server</p>
            </div>
          </div>
          
          <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Nom de famille</label>
              <input 
                type="text" required
                value={newMember.nom}
                onChange={e => setNewMember({...newMember, nom: e.target.value})}
                className="w-full px-5 py-3.5 bg-slate-900/50 border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none transition-all placeholder:text-slate-600"
                placeholder="Ex: DIALLO"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Prénom</label>
              <input 
                type="text" required
                value={newMember.prenom}
                onChange={e => setNewMember({...newMember, prenom: e.target.value})}
                className="w-full px-5 py-3.5 bg-slate-900/50 border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none transition-all placeholder:text-slate-600"
                placeholder="Ex: Amadou"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Adresse Email</label>
              <input 
                type="email" required
                value={newMember.email}
                onChange={e => setNewMember({...newMember, email: e.target.value})}
                className="w-full px-5 py-3.5 bg-slate-900/50 border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none transition-all placeholder:text-slate-600"
                placeholder="amadou@email.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Numéro de téléphone</label>
              <input 
                type="tel" required
                value={newMember.telephone}
                onChange={e => setNewMember({...newMember, telephone: e.target.value})}
                className="w-full px-5 py-3.5 bg-slate-900/50 border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none transition-all placeholder:text-slate-600"
                placeholder="+224 6XX XX XX XX"
              />
            </div>
            
            <div className="md:col-span-2 pt-4">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-slate-900 py-4 rounded-2xl font-black text-lg hover:from-amber-400 hover:to-orange-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-amber-500/10"
              >
                {isSubmitting ? (
                  <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    ENREGISTRER DANS LYBOK.DBO.MEMBRES
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vos cartes de statistiques (celles de la capture) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-800/40 rounded-3xl p-8 border border-white/5 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 text-xl">👥</div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Membres</p>
          </div>
          <p className="text-5xl font-black text-white">{members.length}</p>
        </div>
        <div className="bg-slate-800/40 rounded-3xl p-8 border border-white/5 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-400 text-xl">👑</div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Administrateurs</p>
          </div>
          <p className="text-5xl font-black text-white">1</p>
        </div>
        <div className="bg-slate-800/40 rounded-3xl p-8 border border-white/5 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 text-xl">✅</div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Membres Actifs</p>
          </div>
          <p className="text-5xl font-black text-white">{members.length}</p>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-purple-100 animate-in fade-in zoom-in duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xl">👤</div>
            <h3 className="text-xl font-bold text-gray-800">Ajouter un nouveau membre</h3>
          </div>
          <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input 
                type="text" required
                value={newMember.nom}
                onChange={e => setNewMember({...newMember, nom: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Ex: Diallo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input 
                type="text" required
                value={newMember.prenom}
                onChange={e => setNewMember({...newMember, prenom: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Ex: Amadou"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" required
                value={newMember.email}
                onChange={e => setNewMember({...newMember, email: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="amadou@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input 
                type="tel" required
                value={newMember.telephone}
                onChange={e => setNewMember({...newMember, telephone: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="+224 6XX XX XX XX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Avatar (Emoji)</label>
              <select 
                value={newMember.avatar}
                onChange={e => setNewMember({...newMember, avatar: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option>👨🏿‍💼</option><option>👩🏿‍💼</option><option>👨🏿‍🎓</option><option>👩🏿‍🎓</option><option>👨🏿‍🏫</option><option>👩🏿‍🔬</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
              <select 
                value={newMember.role}
                onChange={e => setNewMember({...newMember, role: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="membre">Membre simple</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
            <div className="md:col-span-2 mt-4">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {isSubmitting ? 'Enregistrement SQL...' : '💾 Enregistrer dans la base lybok'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map(member => {
          const memberContributions = contributions.filter(c => c.userId === member.id);
          const isPaid = memberContributions.some(c => c.month === 'Janvier' && c.year === 2024 && c.status === 'paid');
          return (
            <div key={member.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-0.5">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-3xl">{member.avatar}</div>
                <div>
                  <h3 className="font-bold text-gray-800">{member.name}</h3>
                  <p className="text-xs text-gray-400">{member.email}</p>
                  {member.role === 'admin' && (
                    <span className="inline-block bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full mt-1 font-semibold">👑 Admin</span>
                  )}
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Cotisations</span>
                  <span className="font-semibold">{memberContributions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Mois en cours</span>
                  <span className={`font-semibold ${isPaid ? 'text-emerald-600' : 'text-orange-600'}`}>
                    {isPaid ? '✅ À jour' : '⏳ En attente'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Depuis</span>
                  <span className="font-medium text-gray-600">{member.joinDate}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">➕ Inviter un ancien élève</h3>
        <p className="text-gray-500 text-sm mb-4">Ajoutera un nouveau membre dans lybok.dbo.membres</p>
        <div className="flex items-center space-x-3">
          <input
            type="email"
            placeholder="Email de l'ancien élève"
            className="flex-1 px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-600 transition-all">
            📧 Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// SQL SERVER INDICATOR
// =====================================================
function SQLServerIndicator() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center space-x-2 px-4 py-2.5 rounded-full shadow-xl bg-gradient-to-r from-slate-800 to-slate-900 text-white border border-white/10 backdrop-blur-xl">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
        <DBIcon />
        <span className="text-sm font-semibold">
          ly<span className="text-amber-400">bok</span>
        </span>
        <span className="text-xs text-slate-400 hidden sm:inline">• SQL Server</span>
      </div>
    </div>
  );
}

// =====================================================
// APP PRINCIPALE
// =====================================================
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<typeof currentUser | null>(null);
  const [currentPage, setCurrentPage] = useState('home');

  const handleLogin = (loggedUser: typeof currentUser) => {
    setUser(loggedUser);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCurrentPage('home');
  };

  if (!isLoggedIn || !user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage setCurrentPage={setCurrentPage} />;
      case 'chat': return <ChatPage />;
      case 'subscribe': return <SubscribePage />;
      case 'dashboard': return <DashboardPage />;
      case 'aids': return <AidsPage />;
      case 'members': return <MembersPage />;
      default: return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {renderPage()}
      </main>

      <SQLServerIndicator />

      <footer className="bg-slate-900 text-white mt-12 py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <LybokLogo size="sm" />
            <span className="font-black text-lg tracking-tight">
              Ly<span className="text-amber-400">bok</span>
            </span>
          </div>
          <p className="text-slate-400 text-sm mb-2">
            Plateforme de tontine solidaire des anciens élèves
          </p>
          <p className="text-xs text-slate-600">
            © 2024 Lybok — Base de données SQL Server • Tous droits réservés
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
