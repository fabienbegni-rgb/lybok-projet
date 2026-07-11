import { useState, useEffect, useRef } from 'react';
import { Message } from './types';
import { currentUser, members, initialMessages, contributions, cagnotes, announcements } from './mockData';

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
const ClipboardCheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const formatFCFA = (amount: number) =>
  new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';

const API_BASE = 'http://localhost:3001/api';

// =====================================================
// LOGO LYBOK (SVG animé)
// =====================================================
function LybokLogo({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes lb-spin  { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }
        @keyframes lb-coin  { 0%,100% { transform:scaleX(1) } 45% { transform:scaleX(0.15) } }
        @keyframes lb-pulse { 0%,100% { opacity:1 } 50% { opacity:.5 } }
        .lb-ro { animation:lb-spin 14s linear infinite; transform-origin:50px 50px }
        .lb-co { animation:lb-coin 3.5s ease-in-out infinite; transform-origin:50px 50px }
        .lb-da { animation:lb-pulse 2s ease-in-out infinite }
        .lb-db { animation:lb-pulse 2s ease-in-out infinite .4s }
        .lb-dc { animation:lb-pulse 2s ease-in-out infinite .8s }
      `}</style>
      <rect width="100" height="100" rx="22" fill="#1a8f5c"/>
      <g className="lb-ro">
        <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6"/>
        <circle cx="50" cy="12" r="2.5" fill="rgba(245,200,66,0.6)"/>
        <circle cx="88" cy="50" r="2.5" fill="rgba(245,200,66,0.6)"/>
        <circle cx="50" cy="88" r="2.5" fill="rgba(245,200,66,0.6)"/>
        <circle cx="12" cy="50" r="2.5" fill="rgba(245,200,66,0.6)"/>
      </g>
      <line x1="32" y1="38" x2="50" y2="30" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="50" y1="30" x2="68" y2="38" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="32" y1="38" x2="26" y2="55" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="68" y1="38" x2="74" y2="55" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="26" y1="55" x2="50" y2="64" stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeLinecap="round"/>
      <line x1="74" y1="55" x2="50" y2="64" stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeLinecap="round"/>
      <g className="lb-co">
        <circle cx="50" cy="50" r="11" fill="#f5c842"/>
        <circle cx="50" cy="50" r="8" fill="none" stroke="rgba(26,143,92,0.35)" strokeWidth="1"/>
        <text x="50" y="54" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fontWeight="700" fill="#126640">₣</text>
      </g>
      <circle className="lb-db" cx="50" cy="30" r="5" fill="#f5c842"/>
      <circle className="lb-da" cx="32" cy="38" r="5" fill="#f5c842"/>
      <circle className="lb-dc" cx="68" cy="38" r="5" fill="#f5c842"/>
      <circle cx="26" cy="55" r="4.5" fill="rgba(255,255,255,0.5)"/>
      <circle cx="74" cy="55" r="4.5" fill="rgba(255,255,255,0.5)"/>
      <circle cx="50" cy="64" r="3.5" fill="rgba(255,255,255,0.3)"/>
      <text x="50" y="83" textAnchor="middle" fontFamily="sans-serif" fontSize="7.5" fontWeight="600" fill="rgba(255,255,255,0.65)" letterSpacing="1">LB</text>
    </svg>
  );
}

// =====================================================
// PAGE DE CONNEXION — design épuré, sans bloc statut
// =====================================================
function LoginPage({ onLogin }: { onLogin: (user: typeof currentUser) => void }) {
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login state
  const [email, setEmail]       = useState('amadou.diallo@email.com');
  const [password, setPassword] = useState('demo1234');
  const [showPwd, setShowPwd]   = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register state
  const [rPrenom,    setRPrenom]    = useState('');
  const [rNom,       setRNom]       = useState('');
  const [rEmail,     setREmail]     = useState('');
  const [rTel,       setRTel]       = useState('');
  const [rVille,     setRVille]     = useState('');
  const [rDomaine,   setRDomaine]   = useState('');
  const [rParrain1,  setRParrain1]  = useState('');
  const [rParrain2,  setRParrain2]  = useState('');
  const [rPwd,       setRPwd]       = useState('');
  const [rPwdC,      setRPwdC]      = useState('');
  const [showRPwd,   setShowRPwd]   = useState(false);
  const [rLoading,   setRLoading]   = useState(false);
  const [rError,     setRError]     = useState('');
  const [rSuccess,   setRSuccess]   = useState('');

  const pwdMatch = rPwdC.length > 0 && rPwd !== rPwdC;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    try {
      const res  = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.token) localStorage.setItem('lybok_token', data.token);
        const m = data.membre || {};
        onLogin({
          ...currentUser,
          id:    m.id    || currentUser.id,
          name:  ((m.prenom || '') + ' ' + (m.nom || '')).trim() || currentUser.name,
          email: m.email || email,
          role:  m.role  || 'membre',
        });
      } else {
        // fallback demo
        if (email === 'amadou.diallo@email.com' && password === 'demo1234') {
          onLogin(currentUser);
        } else {
          setLoginError(data.error || 'Email ou mot de passe incorrect.');
        }
      }
    } catch {
      if (email === 'amadou.diallo@email.com' && password === 'demo1234') {
        onLogin(currentUser);
      } else {
        setLoginError('Serveur inaccessible — utilisez les identifiants démo.');
      }
    }
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRError('');
    if (!rNom || !rPrenom || !rEmail || !rVille || !rDomaine || !rPwd) { setRError('Tous les champs * sont obligatoires.'); return; }
    if (rPwd !== rPwdC)  { setRError('Les mots de passe ne correspondent pas.'); return; }
    if (rPwd.length < 6) { setRError('Mot de passe trop court (min. 6 caractères).'); return; }
    const p1 = rParrain1.trim().toLowerCase();
    const p2 = rParrain2.trim().toLowerCase();
    if (!p1 || !p2) { setRError('Deux parrains (membres déjà actifs) sont obligatoires.'); return; }
    if (p1 === p2) { setRError('Les deux parrains doivent être différents.'); return; }
    if (p1 === rEmail.trim().toLowerCase() || p2 === rEmail.trim().toLowerCase()) { setRError('Vous ne pouvez pas être votre propre parrain.'); return; }
    setRLoading(true);
    try {
      const res  = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: rNom.trim(), prenom: rPrenom.trim(),
          email: rEmail.trim().toLowerCase(),
          telephone: rTel.trim() || null,
          ville: rVille.trim(),
          domaine_activite: rDomaine.trim(),
          parrain1_email: p1,
          parrain2_email: p2,
          password: rPwd, mot_de_passe: rPwd,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setRSuccess(`Dossier de ${rPrenom} ${rNom} soumis avec succès, avec vos deux parrainages. Il sera examiné par le bureau avant activation du compte.`);
        setTimeout(() => { setTab('login'); setEmail(rEmail); setRSuccess(''); }, 4000);
      } else {
        setRError(data.error || data.message || `Erreur ${res.status}`);
      }
    } catch (err: any) {
      setRError(`Serveur inaccessible (${err?.message || 'network error'})`);
    }
    setRLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    padding: '9px 12px', fontSize: 14,
    border: '1px solid #d1d9e0', borderRadius: 8,
    background: '#f8f9fa', color: '#1a202c',
    outline: 'none', fontFamily: 'DM Sans, sans-serif',
    transition: 'border-color .15s, box-shadow .15s',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 13, fontWeight: 600,
    color: '#4a5568', marginBottom: 5,
  };
  const iconInputStyle: React.CSSProperties = {
    ...inputStyle, paddingLeft: 34,
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#f4f6f9',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, fontFamily: 'DM Sans, sans-serif',
    }}>
      {/* background blobs */}
      <div style={{ position:'fixed', top:-120, left:-120, width:400, height:400, borderRadius:'50%', background:'#1a8f5c10', zIndex:0 }}/>
      <div style={{ position:'fixed', bottom:-80, right:-80, width:300, height:300, borderRadius:'50%', background:'#f5a62312', zIndex:0 }}/>

      <div style={{
        position:'relative', zIndex:1,
        display:'flex', flexWrap:'wrap',
        width:'100%', maxWidth:880,
        background:'#fff', borderRadius:20,
        overflow:'hidden', boxShadow:'0 16px 64px rgba(0,0,0,0.10)',
      }}>

        {/* ── Panneau gauche (branding) ── */}
        <div className="p-6 sm:p-10 lg:p-12" style={{
          flex:'1 1 340px',
          background:`linear-gradient(145deg, #1a8f5c, #126640)`,
          display:'flex', flexDirection:'column',
          justifyContent:'space-between',
          minHeight:480, position:'relative', overflow:'hidden',
        }}>
          <div style={{ position:'absolute', top:-60, right:-60, width:240, height:240, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }}/>
          <div style={{ position:'absolute', bottom:40, left:-40, width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }}/>

          <div style={{ position:'relative' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:'2.5rem' }}>
              <LybokLogo size={52}/>
              <div>
                <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:26, color:'#fff', letterSpacing:-1 }}>Lybok</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.7)', textTransform:'uppercase', letterSpacing:'0.08em' }}>Tontine solidaire</div>
              </div>
            </div>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:22, color:'#fff', lineHeight:1.3, marginBottom:10, marginTop:0 }}>
              Bienvenue sur votre plateforme de tontine
            </h2>
            <p style={{ color:'rgba(255,255,255,0.75)', fontSize:14, lineHeight:1.6, marginBottom:'2rem', marginTop:0 }}>
              Gérez vos cotisations, cagnottes et aides sociales en toute simplicité.
            </p>
            <div>
              {[
                { icon:'🔒', text:'Sécurité maximale des données' },
                { icon:'📊', text:'Suivi en temps réel' },
                { icon:'❤️', text:'Aides sociales intégrées' },
              ].map((f, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                  <div style={{ width:32, height:32, background:'rgba(255,255,255,0.15)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>{f.icon}</div>
                  <span style={{ color:'rgba(255,255,255,0.85)', fontSize:14 }}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, position:'relative' }}>
            {[
              { v:'8',           l:'Membres actifs' },
              { v:'200K FCFA',   l:'Cagnotte/mois' },
              { v:'3',           l:'Cagnottes' },
              { v:'180K FCFA',   l:'Aides versées' },
            ].map((s, i) => (
              <div key={i} style={{ background:'rgba(255,255,255,0.12)', borderRadius:12, padding:12 }}>
                <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:18, color:'#fff' }}>{s.v}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.65)', marginTop:2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Panneau droit (formulaire) ── */}
        <div className="p-6 sm:p-10" style={{ flex:'1 1 320px', display:'flex', flexDirection:'column', justifyContent:'center' }}>

          {/* Onglets */}
          <div style={{ display:'flex', background:'#f4f6f9', borderRadius:12, padding:4, marginBottom:22, gap:4 }}>
            {(['login','register'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setLoginError(''); setRError(''); setRSuccess(''); }}
                style={{
                  flex:1, padding:'9px', borderRadius:9, border:'none', cursor:'pointer',
                  transition:'all .15s',
                  background: tab === t ? '#fff' : 'transparent',
                  color:      tab === t ? '#1a8f5c' : '#9aa5b4',
                  fontFamily:'DM Sans, sans-serif', fontSize:13,
                  fontWeight: tab === t ? 700 : 400,
                  boxShadow:  tab === t ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {t === 'login' ? '🔑 Se connecter' : '➕ Créer un membre'}
              </button>
            ))}
          </div>

          <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:22, color:'#1a202c', marginBottom:4, marginTop:0 }}>
            {tab === 'login' ? 'Bon retour !' : 'Nouveau membre'}
          </h2>
          <p style={{ color:'#9aa5b4', fontSize:13, marginBottom:20, marginTop:0 }}>
            {tab === 'login'
              ? 'Connectez-vous à votre espace tontine'
              : 'Ajoutez un membre dans dbo.membres'}
          </p>

          {/* Alertes */}
          {loginError && (
            <div style={{ background:'#fdecea', border:'1px solid rgba(231,76,60,0.3)', color:'#e74c3c', padding:'10px 14px', borderRadius:10, fontSize:13, marginBottom:14 }}>
              ⚠️ {loginError}
            </div>
          )}
          {rError && (
            <div style={{ background:'#fdecea', border:'1px solid rgba(231,76,60,0.3)', color:'#e74c3c', padding:'10px 14px', borderRadius:10, fontSize:13, marginBottom:14 }}>
              ⚠️ {rError}
            </div>
          )}
          {rSuccess && (
            <div style={{ background:'#e8f5ee', border:'1px solid rgba(26,143,92,0.3)', color:'#1a8f5c', padding:'10px 14px', borderRadius:10, fontSize:13, marginBottom:14 }}>
              ✅ {rSuccess}
            </div>
          )}

          {/* ── Formulaire connexion ── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom:14 }}>
                <label style={labelStyle}>Email</label>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', fontSize:16, color:'#9aa5b4', pointerEvents:'none' }}>✉️</span>
                  <input
                    type="email" required
                    value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    style={{ ...iconInputStyle }}
                    onFocus={e => { e.target.style.borderColor='#1a8f5c'; e.target.style.boxShadow='0 0 0 3px rgba(26,143,92,0.12)'; }}
                    onBlur={e  => { e.target.style.borderColor='#d1d9e0'; e.target.style.boxShadow='none'; }}
                  />
                </div>
              </div>

              <div style={{ marginBottom:6 }}>
                <label style={labelStyle}>Mot de passe</label>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', fontSize:16, color:'#9aa5b4', pointerEvents:'none' }}>🔒</span>
                  <input
                    type={showPwd ? 'text' : 'password'} required
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ ...iconInputStyle, paddingRight:38 }}
                    onFocus={e => { e.target.style.borderColor='#1a8f5c'; e.target.style.boxShadow='0 0 0 3px rgba(26,143,92,0.12)'; }}
                    onBlur={e  => { e.target.style.borderColor='#d1d9e0'; e.target.style.boxShadow='none'; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(v => !v)}
                    style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#9aa5b4', fontSize:16 }}
                  >
                    {showPwd ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div style={{ textAlign:'right', marginBottom:20 }}>
                <a href="#" style={{ fontSize:12, color:'#9aa5b4', textDecoration:'none' }}>Mot de passe oublié ?</a>
              </div>

              <button
                type="submit" disabled={isLoading}
                style={{
                  width:'100%', padding:'12px',
                  borderRadius:10, border:'none',
                  background: isLoading ? '#e8ecf0' : '#1a8f5c',
                  color: isLoading ? '#9aa5b4' : '#fff',
                  fontFamily:'DM Sans, sans-serif', fontSize:15, fontWeight:700,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition:'all .15s',
                }}
              >
                {isLoading ? '⟳ Connexion...' : 'Se connecter'}
              </button>

              <p style={{ textAlign:'center', fontSize:12, color:'#9aa5b4', marginTop:16, marginBottom:0 }}>
                Démo : <code style={{ fontSize:11 }}>amadou.diallo@email.com</code> / <code style={{ fontSize:11 }}>demo1234</code>
              </p>
            </form>
          )}

          {/* ── Formulaire inscription ── */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} style={{ overflowY:'auto', maxHeight:'52vh' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
                <div>
                  <label style={labelStyle}>Prénom <span style={{ color:'#1a8f5c' }}>*</span></label>
                  <input
                    value={rPrenom} onChange={e => setRPrenom(e.target.value)}
                    placeholder="Fabien" style={inputStyle} required
                    onFocus={e => { e.target.style.borderColor='#1a8f5c'; e.target.style.boxShadow='0 0 0 3px rgba(26,143,92,0.12)'; e.target.style.background='#fff'; }}
                    onBlur={e  => { e.target.style.borderColor='#d1d9e0'; e.target.style.boxShadow='none'; e.target.style.background='#f8f9fa'; }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Nom <span style={{ color:'#1a8f5c' }}>*</span></label>
                  <input
                    value={rNom} onChange={e => setRNom(e.target.value)}
                    placeholder="BEGNI" style={inputStyle} required
                    onFocus={e => { e.target.style.borderColor='#1a8f5c'; e.target.style.boxShadow='0 0 0 3px rgba(26,143,92,0.12)'; e.target.style.background='#fff'; }}
                    onBlur={e  => { e.target.style.borderColor='#d1d9e0'; e.target.style.boxShadow='none'; e.target.style.background='#f8f9fa'; }}
                  />
                </div>
              </div>

              <div style={{ marginBottom:14 }}>
                <label style={labelStyle}>Email <span style={{ color:'#1a8f5c' }}>*</span></label>
                <input
                  type="email" value={rEmail} onChange={e => setREmail(e.target.value)}
                  placeholder="membre@email.com" style={inputStyle} required
                  onFocus={e => { e.target.style.borderColor='#1a8f5c'; e.target.style.boxShadow='0 0 0 3px rgba(26,143,92,0.12)'; e.target.style.background='#fff'; }}
                  onBlur={e  => { e.target.style.borderColor='#d1d9e0'; e.target.style.boxShadow='none'; e.target.style.background='#f8f9fa'; }}
                />
              </div>

              <div style={{ marginBottom:14 }}>
                <label style={labelStyle}>Téléphone</label>
                <input
                  value={rTel} onChange={e => setRTel(e.target.value)}
                  placeholder="+237 6XX XXX XXX" style={inputStyle}
                  onFocus={e => { e.target.style.borderColor='#1a8f5c'; e.target.style.boxShadow='0 0 0 3px rgba(26,143,92,0.12)'; e.target.style.background='#fff'; }}
                  onBlur={e  => { e.target.style.borderColor='#d1d9e0'; e.target.style.boxShadow='none'; e.target.style.background='#f8f9fa'; }}
                />
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
                <div>
                  <label style={labelStyle}>Ville <span style={{ color:'#1a8f5c' }}>*</span></label>
                  <input
                    value={rVille} onChange={e => setRVille(e.target.value)}
                    placeholder="Bokito" style={inputStyle} required
                    onFocus={e => { e.target.style.borderColor='#1a8f5c'; e.target.style.boxShadow='0 0 0 3px rgba(26,143,92,0.12)'; e.target.style.background='#fff'; }}
                    onBlur={e  => { e.target.style.borderColor='#d1d9e0'; e.target.style.boxShadow='none'; e.target.style.background='#f8f9fa'; }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Domaine d'activité <span style={{ color:'#1a8f5c' }}>*</span></label>
                  <input
                    value={rDomaine} onChange={e => setRDomaine(e.target.value)}
                    placeholder="Commerce, santé, informatique..." style={inputStyle} required
                    onFocus={e => { e.target.style.borderColor='#1a8f5c'; e.target.style.boxShadow='0 0 0 3px rgba(26,143,92,0.12)'; e.target.style.background='#fff'; }}
                    onBlur={e  => { e.target.style.borderColor='#d1d9e0'; e.target.style.boxShadow='none'; e.target.style.background='#f8f9fa'; }}
                  />
                </div>
              </div>

              <div style={{ marginBottom:14 }}>
                <label style={labelStyle}>Parrainage <span style={{ color:'#1a8f5c' }}>*</span></label>
                <p style={{ fontSize:11, color:'#9aa5b4', marginTop:0, marginBottom:8 }}>Deux membres déjà actifs doivent se porter garants. Votre dossier restera en attente jusqu'à validation par le bureau.</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  <input
                    type="email" value={rParrain1} onChange={e => setRParrain1(e.target.value)}
                    placeholder="Email parrain 1" style={inputStyle} required
                    onFocus={e => { e.target.style.borderColor='#1a8f5c'; e.target.style.boxShadow='0 0 0 3px rgba(26,143,92,0.12)'; e.target.style.background='#fff'; }}
                    onBlur={e  => { e.target.style.borderColor='#d1d9e0'; e.target.style.boxShadow='none'; e.target.style.background='#f8f9fa'; }}
                  />
                  <input
                    type="email" value={rParrain2} onChange={e => setRParrain2(e.target.value)}
                    placeholder="Email parrain 2" style={inputStyle} required
                    onFocus={e => { e.target.style.borderColor='#1a8f5c'; e.target.style.boxShadow='0 0 0 3px rgba(26,143,92,0.12)'; e.target.style.background='#fff'; }}
                    onBlur={e  => { e.target.style.borderColor='#d1d9e0'; e.target.style.boxShadow='none'; e.target.style.background='#f8f9fa'; }}
                  />
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
                <div>
                  <label style={labelStyle}>Mot de passe <span style={{ color:'#1a8f5c' }}>*</span></label>
                  <div style={{ position:'relative' }}>
                    <input
                      type={showRPwd ? 'text' : 'password'}
                      value={rPwd} onChange={e => setRPwd(e.target.value)}
                      placeholder="••••••••" style={{ ...inputStyle, paddingRight:36 }} required
                      onFocus={e => { e.target.style.borderColor='#1a8f5c'; e.target.style.boxShadow='0 0 0 3px rgba(26,143,92,0.12)'; e.target.style.background='#fff'; }}
                      onBlur={e  => { e.target.style.borderColor='#d1d9e0'; e.target.style.boxShadow='none'; e.target.style.background='#f8f9fa'; }}
                    />
                    <button
                      type="button" onClick={() => setShowRPwd(v => !v)}
                      style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#9aa5b4', fontSize:14 }}
                    >
                      {showRPwd ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Confirmer <span style={{ color:'#1a8f5c' }}>*</span></label>
                  <input
                    type="password"
                    value={rPwdC} onChange={e => setRPwdC(e.target.value)}
                    placeholder="••••••••"
                    style={{ ...inputStyle, borderColor: pwdMatch ? '#e74c3c' : '#d1d9e0' }} required
                    onFocus={e => { if (!pwdMatch) { e.target.style.borderColor='#1a8f5c'; e.target.style.boxShadow='0 0 0 3px rgba(26,143,92,0.12)'; } e.target.style.background='#fff'; }}
                    onBlur={e  => { e.target.style.borderColor= pwdMatch ? '#e74c3c' : '#d1d9e0'; e.target.style.boxShadow='none'; e.target.style.background='#f8f9fa'; }}
                  />
                  {pwdMatch && <p style={{ fontSize:11, color:'#e74c3c', marginTop:4, marginBottom:0 }}>Ne correspond pas</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={rLoading || pwdMatch}
                style={{
                  width:'100%', padding:'12px',
                  borderRadius:10, border:'none',
                  background: rLoading || pwdMatch ? '#e8ecf0' : '#1a8f5c',
                  color: rLoading || pwdMatch ? '#9aa5b4' : '#fff',
                  fontFamily:'DM Sans, sans-serif', fontSize:15, fontWeight:700,
                  cursor: rLoading || pwdMatch ? 'not-allowed' : 'pointer',
                  transition:'all .15s',
                }}
              >
                {rLoading ? '⟳ Enregistrement...' : 'Créer le membre'}
              </button>
            </form>
          )}
        </div>
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navItems = [
    { id: 'home',      label: 'Accueil',         icon: <HomeIcon /> },
    { id: 'chat',      label: 'Chat',             icon: <ChatIcon /> },
    { id: 'subscribe', label: 'Cagnote',          icon: <WalletIcon /> },
    { id: 'dashboard', label: 'Tableau de bord',  icon: <ChartIcon /> },
    { id: 'aids',      label: 'Aides',            icon: <HeartIcon /> },
    { id: 'members',   label: 'Membres',          icon: <UsersIcon /> },
    ...(user.role === 'admin' || user.role === 'tresorier'
      ? [{ id: 'validation', label: 'Validations', icon: <ClipboardCheckIcon /> }]
      : []),
  ];

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3 cursor-pointer min-w-0" onClick={() => setCurrentPage('home')}>
            <LybokLogo size={40}/>
            <div className="min-w-0">
              <h1 className="font-black text-lg leading-tight tracking-tight truncate">Ly<span className="text-amber-400">bok</span></h1>
              <p className="hidden sm:block text-[10px] text-slate-400 font-medium tracking-wider uppercase truncate">Tontine solidaire</p>
            </div>
          </div>

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
                    {user.role === 'admin' ? '👑 Administrateur' : user.role === 'tresorier' ? '💼 Trésorier' : '👤 Membre'}
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

          <button
            onClick={() => setShowMobileMenu(v => !v)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-all text-slate-300"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showMobileMenu
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {showMobileMenu && (
          <div className="lg:hidden pb-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setCurrentPage(item.id); setShowMobileMenu(false); }}
                className={`flex items-center space-x-2 px-3 py-2.5 rounded-lg transition-all text-sm ${
                  currentPage === item.id
                    ? 'bg-amber-500/20 text-amber-400 font-semibold'
                    : 'hover:bg-white/5 text-slate-300'
                }`}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>
        )}
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
      <section className="relative rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500"></div>
        <div className="relative z-10 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-4">
            <LybokLogo size={48}/>
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">Base lybok connectée ✓</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">Bienvenue sur <span className="text-amber-300">Lybok</span> ! 🤝</h2>
          <p className="text-lg md:text-xl text-emerald-100 mb-6 max-w-2xl">Notre plateforme de tontine solidaire pour soutenir les anciens élèves.</p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => setCurrentPage('subscribe')} className="bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-all shadow-lg">💰 Cotiser maintenant</button>
            <button onClick={() => setCurrentPage('aids')} className="bg-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20">❤️ Voir nos actions</button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Membres</p><p className="text-3xl font-black text-gray-800 mt-1">{members.length}</p></div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl">👥</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Cotisations</p><p className="text-3xl font-black text-emerald-600 mt-1">{paidThisMonth}/{members.length}</p></div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">✅</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Collecté</p><p className="text-2xl font-black text-blue-600 mt-1">{currentCagnot ? formatFCFA(currentCagnot.collectedAmount) : '0'}</p></div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl">💵</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Aides</p><p className="text-2xl font-black text-rose-600 mt-1">{formatFCFA(180000)}</p></div>
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-2xl">❤️</div>
          </div>
        </div>
      </div>

      <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800">📊 Cagnote en cours</h3>
            <p className="text-sm text-gray-400">Janvier 2024 — Objectif: {formatFCFA(currentCagnot?.targetAmount || 0)}</p>
          </div>
          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">● Active</span>
        </div>
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Progression</span>
            <span className="font-bold text-emerald-600">{currentCagnot ? Math.round((currentCagnot.collectedAmount / currentCagnot.targetAmount) * 100) : 0}%</span>
          </div>
          <div className="h-5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-1000"
              style={{ width: `${currentCagnot ? (currentCagnot.collectedAmount / currentCagnot.targetAmount) * 100 : 0}%` }}/>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-500 font-medium">{formatFCFA(currentCagnot?.collectedAmount || 0)}</span>
            <span className="text-gray-400">{formatFCFA(currentCagnot?.targetAmount || 0)}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="bg-emerald-50 rounded-xl p-4"><p className="text-2xl font-black text-emerald-600">{paidThisMonth}</p><p className="text-xs text-gray-500 mt-1">Ayant cotisé</p></div>
          <div className="bg-orange-50 rounded-xl p-4"><p className="text-2xl font-black text-orange-600">{members.length - paidThisMonth}</p><p className="text-xs text-gray-500 mt-1">En attente</p></div>
          <div className="bg-blue-50 rounded-xl p-4"><p className="text-2xl font-black text-blue-600">25 000</p><p className="text-xs text-gray-500 mt-1">FCFA / mois</p></div>
          <div className="bg-rose-50 rounded-xl p-4"><p className="text-2xl font-black text-rose-600">25</p><p className="text-xs text-gray-500 mt-1">Jours restants</p></div>
        </div>
      </section>

      <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">📢 Annonces récentes</h3>
        <div className="space-y-4">
          {announcements.map(ann => (
            <div key={ann.id} className={`p-4 rounded-xl border-l-4 ${ann.priority === 'urgent' ? 'bg-red-50 border-red-500' : ann.priority === 'important' ? 'bg-amber-50 border-amber-500' : 'bg-blue-50 border-blue-500'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800">{ann.title}</h4>
                  <p className="text-gray-600 mt-1 text-sm">{ann.content}</p>
                  <p className="text-xs text-gray-400 mt-2">Par {ann.author} • {ann.date}</p>
                </div>
                {ann.priority === 'urgent' && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">Urgent</span>}
              </div>
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
function ChatPage({ user }: { user: typeof currentUser }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      content: newMessage,
      timestamp: new Date(),
      type: 'message',
    }]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-[calc(100vh-8rem)]">
      <div className="flex-shrink-0 bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4 border-b border-white/5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-lg flex-shrink-0">💬</div>
            <div className="min-w-0">
              <h3 className="font-bold truncate">Discussion du groupe</h3>
              <p className="text-xs text-slate-400">{members.length} membres</p>
            </div>
          </div>
          <div className="hidden sm:flex -space-x-2 flex-shrink-0">
            {members.slice(0, 5).map((m, idx) => (
              <div key={m.id} className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-sm border-2 border-slate-800" style={{ zIndex: 10 - idx }}>{m.avatar}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map(msg => {
          const isMe = msg.userId === user.id;
          const member = members.find(m => m.id === msg.userId);
          if (msg.type === 'info') return (
            <div key={msg.id} className="flex justify-center">
              <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-xs font-medium max-w-md text-center">{msg.content}</div>
            </div>
          );
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-end space-x-2 max-w-[75%] ${isMe ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {!isMe && <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-sm flex-shrink-0">{member?.avatar}</div>}
                <div>
                  {!isMe && <p className="text-xs text-gray-400 mb-1 ml-1 font-medium">{msg.userName}</p>}
                  <div className={`px-4 py-3 rounded-2xl ${isMe ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-br-md' : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'}`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <p className={`text-[10px] text-gray-400 mt-1 ${isMe ? 'text-right mr-1' : 'ml-1'}`}>{msg.timestamp.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' })}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef}/>
      </div>
      <div className="flex-shrink-0 p-4 bg-white border-t border-gray-100">
        <div className="flex items-center space-x-3">
          <textarea
            value={newMessage} onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Écrivez votre message..."
            className="flex-1 px-4 py-3 bg-gray-100 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
            rows={1}
          />
          <button onClick={handleSend} disabled={!newMessage.trim()} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// PAGES STUB — inchangées
// =====================================================
function SubscribePage() {
  const [selectedAmount, setSelectedAmount] = useState(25000);
  const [paymentMethod, setPaymentMethod]   = useState('orange');
  const [phoneNumber, setPhoneNumber]       = useState('');
  const [showSuccess, setShowSuccess]       = useState(false);
  const amounts = [10000,15000,20000,25000,30000,50000];
  const handleSubscribe = () => { setShowSuccess(true); setTimeout(() => setShowSuccess(false), 5000); };
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-4xl">✅</span></div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Paiement enregistré !</h3>
            <p className="text-gray-500 mb-6">Votre cotisation de <strong className="text-emerald-600">{formatFCFA(selectedAmount)}</strong> a été enregistrée.</p>
            <button onClick={() => setShowSuccess(false)} className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-emerald-700">Fermer</button>
          </div>
        </div>
      )}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-500 rounded-2xl p-6 text-white"><h2 className="text-2xl font-bold mb-2">💰 Cotisation Mensuelle</h2><p className="text-emerald-100 text-sm">Contribuez à la cagnote solidaire</p></div>
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Montant</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {amounts.map(a => (
            <button key={a} onClick={() => setSelectedAmount(a)} className={`py-4 px-3 rounded-xl font-bold text-sm sm:text-base transition-all ${selectedAmount===a ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{formatFCFA(a)}</button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Mode de paiement</h3>
        <div className="space-y-3">
          {[{id:'orange',name:'Orange Money',icon:'📱'},{id:'mtn',name:'MTN Mobile Money',icon:'📱'},{id:'wave',name:'Wave',icon:'🌊'}].map(pm => (
            <button key={pm.id} onClick={() => setPaymentMethod(pm.id)} className={`w-full flex items-center p-4 rounded-xl transition-all ${paymentMethod===pm.id ? 'bg-emerald-50 border-2 border-emerald-500' : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'}`}>
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-2xl mr-4">{pm.icon}</div>
              <div className="text-left"><p className="font-semibold text-gray-800">{pm.name}</p><p className="text-sm text-gray-500">Paiement mobile</p></div>
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Numéro de téléphone</h3>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+224</span>
          <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="6XX XX XX XX" className="w-full pl-20 pr-4 py-4 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-lg"/>
        </div>
      </div>
      <button onClick={handleSubscribe} disabled={!phoneNumber} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/25">💳 Procéder au paiement</button>
    </div>
  );
}

function DashboardPage({ user }: { user: typeof currentUser }) {
  const [selectedMonth, setSelectedMonth] = useState('Janvier');
  const userContributions = contributions.filter(c => c.userId === user.id);
  const totalPaid = userContributions.reduce((sum, c) => sum + (c.status === 'paid' ? c.amount : 0), 0);
  const monthContributions = contributions.filter(c => c.month === selectedMonth && c.year === 2024);
  const roleLabel = user.role === 'admin' ? '👑 Admin' : user.role === 'tresorier' ? '💼 Trésorier' : '👤 Membre';
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center text-4xl">{user.avatar}</div>
          <div><h2 className="text-2xl font-bold">{user.name}</h2><p className="text-slate-400 text-sm">{user.email}</p><span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full font-medium">{roleLabel}</span></div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100"><p className="text-gray-400 text-xs font-medium uppercase">Mes cotisations</p><p className="text-2xl font-black text-emerald-600 mt-1">{userContributions.length}</p></div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100"><p className="text-gray-400 text-xs font-medium uppercase">Total versé</p><p className="text-xl font-black text-blue-600 mt-1">{formatFCFA(totalPaid)}</p></div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100"><p className="text-gray-400 text-xs font-medium uppercase">Statut</p><p className="text-lg font-bold text-emerald-600 mt-1">✅ À jour</p></div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100"><p className="text-gray-400 text-xs font-medium uppercase">Rang</p><p className="text-2xl font-black text-purple-600 mt-1">#3</p></div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">📊 Cotisations du mois</h3>
          <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="bg-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
            <option value="Janvier">Janvier 2024</option><option value="Décembre">Décembre 2023</option><option value="Novembre">Novembre 2023</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-gray-100"><th className="text-left py-3 px-4 text-gray-400 font-medium text-xs uppercase tracking-wide">Membre</th><th className="text-left py-3 px-4 text-gray-400 font-medium text-xs uppercase tracking-wide">Montant</th><th className="text-left py-3 px-4 text-gray-400 font-medium text-xs uppercase tracking-wide">Date</th><th className="text-left py-3 px-4 text-gray-400 font-medium text-xs uppercase tracking-wide">Statut</th></tr></thead>
            <tbody>
              {monthContributions.map(c => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4"><div className="flex items-center space-x-3"><span className="text-xl">{members.find(m=>m.id===c.userId)?.avatar}</span><span className="font-medium text-gray-800 text-sm">{c.userName}</span></div></td>
                  <td className="py-4 px-4 font-bold text-gray-800 text-sm">{formatFCFA(c.amount)}</td>
                  <td className="py-4 px-4 text-gray-500 text-sm">{c.paymentDate||'—'}</td>
                  <td className="py-4 px-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${c.status==='paid'?'bg-emerald-100 text-emerald-700':c.status==='pending'?'bg-yellow-100 text-yellow-700':'bg-red-100 text-red-700'}`}>{c.status==='paid'?'✅ Payé':c.status==='pending'?'⏳ En attente':'⚠️ En retard'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AidsPage() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = () => { setSubmitted(true); setTimeout(() => { setSubmitted(false); setShowForm(false); }, 3000); };
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl p-6 text-white"><h2 className="text-2xl font-bold mb-2">❤️ Aides Sociales</h2><p className="text-rose-100 text-sm">L'entraide au cœur de Lybok</p></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[{icon:'💰',value:formatFCFA(180000),label:'Total distribué'},{icon:'👥',value:'12',label:'Bénéficiaires'},{icon:'📚',value:'5',label:'Étudiants soutenus'}].map(s=>(
          <div key={s.label} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center"><div className="w-14 h-14 bg-rose-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-2xl">{s.icon}</div><p className="text-2xl font-black text-rose-600">{s.value}</p><p className="text-gray-500 text-sm">{s.label}</p></div>
        ))}
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">📝 Demander une aide</h3>
          <button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-rose-600 hover:to-pink-600 transition-all">{showForm ? '✕ Fermer' : '+ Nouvelle demande'}</button>
        </div>
        {submitted && <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4 text-center"><p className="text-emerald-700 font-semibold">✅ Demande soumise avec succès !</p></div>}
        {showForm && !submitted && (
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Motif</label><select className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"><option>Frais médicaux</option><option>Frais de scolarité</option><option>Urgence familiale</option><option>Autre</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Description</label><textarea placeholder="Décrivez votre situation..." className="w-full px-4 py-3 bg-gray-100 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-rose-500" rows={4}/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Montant demandé (FCFA)</label><input type="number" placeholder="Ex: 50000" className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"/></div>
            <button onClick={handleSubmit} className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-rose-600 hover:to-pink-600 transition-all">📨 Soumettre la demande</button>
          </div>
        )}
      </div>
    </div>
  );
}

function MembersPage() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-400">Annuaire du réseau — seules les informations utiles au réseau sont visibles ici (voir la politique de confidentialité).</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map(member => (
          <div key={member.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-0.5">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-3xl">{member.avatar}</div>
              <div>
                <h3 className="font-bold text-gray-800">{member.name}</h3>
                <p className="text-xs text-gray-400">{member.activityDomain}</p>
                <p className="text-xs text-gray-400">📍 {member.city}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =====================================================
// VALIDATION DES DOSSIERS EN ATTENTE (bureau)
// =====================================================
interface PendingMember {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  ville: string;
  domaine_activite: string;
  date_inscription: string;
  parrain1_nom: string | null;
  parrain1_prenom: string | null;
  parrain1_email: string | null;
  parrain2_nom: string | null;
  parrain2_prenom: string | null;
  parrain2_email: string | null;
}

function ValidationPage() {
  const [pending, setPending]   = useState<PendingMember[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [actingOn, setActingOn] = useState<string | null>(null);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + (localStorage.getItem('lybok_token') || ''),
  });

  const loadPending = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/membres/en-attente`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Erreur ${res.status}`);
      setPending(data);
    } catch (err: any) {
      setError(err?.message || 'Serveur inaccessible.');
    }
    setLoading(false);
  };

  useEffect(() => { loadPending(); }, []);

  const handleDecision = async (id: string, decision: 'valider' | 'refuser') => {
    setActingOn(id);
    try {
      const res = await fetch(`${API_BASE}/membres/${id}/${decision}`, { method: 'PATCH', headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Erreur ${res.status}`);
      setPending(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      setError(err?.message || 'Serveur inaccessible.');
    }
    setActingOn(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">📋 Dossiers en attente</h2>
        <p className="text-slate-300 text-sm">Chaque candidature doit être appuyée par deux parrains actifs avant validation par le bureau.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">⚠️ {error}</div>
      )}

      {loading ? (
        <div className="text-center text-gray-400 py-12">Chargement...</div>
      ) : pending.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center text-gray-400">
          Aucun dossier en attente pour le moment.
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map(p => (
            <div key={p.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{p.prenom} {p.nom}</h3>
                  <p className="text-sm text-gray-500">{p.email}{p.telephone ? ` • ${p.telephone}` : ''}</p>
                  <p className="text-sm text-gray-500">{p.domaine_activite} • 📍 {p.ville}</p>
                  <p className="text-xs text-gray-400 mt-1">Soumis le {new Date(p.date_inscription).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDecision(p.id, 'valider')}
                    disabled={actingOn === p.id}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all disabled:opacity-50"
                  >
                    ✅ Valider
                  </button>
                  <button
                    onClick={() => handleDecision(p.id, 'refuser')}
                    disabled={actingOn === p.id}
                    className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 transition-all disabled:opacity-50"
                  >
                    ✕ Refuser
                  </button>
                </div>
              </div>
              <div className="border-t border-gray-100 mt-4 pt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Parrain 1</p>
                  <p className="font-medium text-gray-700">{p.parrain1_prenom} {p.parrain1_nom}</p>
                  <p className="text-gray-400 text-xs">{p.parrain1_email}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Parrain 2</p>
                  <p className="font-medium text-gray-700">{p.parrain2_prenom} {p.parrain2_nom}</p>
                  <p className="text-gray-400 text-xs">{p.parrain2_email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =====================================================
// APP PRINCIPALE
// =====================================================
function App() {
  const [isLoggedIn, setIsLoggedIn]     = useState(false);
  const [user, setUser]                 = useState<typeof currentUser | null>(null);
  const [currentPage, setCurrentPage]   = useState('home');

  const handleLogin   = (u: typeof currentUser) => { setUser(u); setIsLoggedIn(true); };
  const handleLogout  = () => { setIsLoggedIn(false); setUser(null); setCurrentPage('home'); localStorage.removeItem('lybok_token'); };

  if (!isLoggedIn || !user) return <LoginPage onLogin={handleLogin}/>;

  const renderPage = () => {
    switch (currentPage) {
      case 'home':      return <HomePage setCurrentPage={setCurrentPage}/>;
      case 'chat':      return <ChatPage user={user}/>;
      case 'subscribe': return <SubscribePage/>;
      case 'dashboard': return <DashboardPage user={user}/>;
      case 'aids':      return <AidsPage/>;
      case 'members':   return <MembersPage/>;
      case 'validation':
        return (user.role === 'admin' || user.role === 'tresorier')
          ? <ValidationPage/>
          : <HomePage setCurrentPage={setCurrentPage}/>;
      default:          return <HomePage setCurrentPage={setCurrentPage}/>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} onLogout={handleLogout}/>
      <main className="max-w-7xl mx-auto px-4 py-6">{renderPage()}</main>
      <div className="fixed bottom-4 right-4 z-50">
        <div className="flex items-center space-x-2 px-4 py-2.5 rounded-full shadow-xl bg-gradient-to-r from-slate-800 to-slate-900 text-white border border-white/10">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <DBIcon/>
          <span className="text-sm font-semibold">ly<span className="text-amber-400">bok</span></span>
          <span className="text-xs text-slate-400 hidden sm:inline">• PostgreSQL</span>
        </div>
      </div>
      <footer className="bg-slate-900 text-white mt-12 py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <LybokLogo size={32}/>
            <span className="font-black text-lg tracking-tight">Ly<span className="text-amber-400">bok</span></span>
          </div>
          <p className="text-slate-400 text-sm mb-2">Plateforme de tontine solidaire des anciens élèves</p>
          <p className="text-xs text-slate-600">© 2024 Lybok — Supabase PostgreSQL • Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
}

export default App;