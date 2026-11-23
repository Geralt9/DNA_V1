import { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, SignOut } from '@phosphor-icons/react';
import ThemedArt from '../components/ThemedArt.jsx';
import Field from '../components/Field.jsx';
import PageLoader, { Spinner } from '../components/PageLoader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useForm, rules } from '../hooks/useForm.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { USE_MOCKS } from '../services/config.js';
import { DEMO_USER } from '../mocks/users.js';
import './Account.css';

export default function Account() {
  const { status, isAuthenticated } = useAuth();
  const [params, setParams] = useSearchParams();
  const mode = params.get('mode') === 'login' ? 'login' : 'signup';
  useDocumentTitle(isAuthenticated ? 'Your account' : mode === 'login' ? 'Log in' : 'Create an account');

  const setMode = (m) => setParams(m === 'login' ? { mode: 'login' } : {}, { replace: true });

  return (
    <div className="page account">
      <div className="account__layout container">
        <div className="account__art">
          <ThemedArt
            pair="account"
            className="account__img"
            sizes="(max-width: 900px) 92vw, 42vw"
            priority
            position="50% 40%"
            alt={{
              light: 'Painting of a robed figure walking a bridge of cloud toward a glowing arched gate',
              dark: 'Painting of a gothic cathedral nave lit by a green stained-glass window and candles',
            }}
          >
            <p className="account__art-caption" aria-hidden="true">
              <span>Enter</span>
              <em>the house of ink</em>
            </p>
          </ThemedArt>
        </div>

        <div className="account__panel">
          {status === 'checking' ? (
            <PageLoader label="Checking your session" />
          ) : isAuthenticated ? (
            <Profile />
          ) : (
            <AuthForms mode={mode} setMode={setMode} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Sign up / Log in ─────────────────────────────────────────────── */
function AuthForms({ mode, setMode }) {
  const tabs = [
    { id: 'signup', label: 'Create account' },
    { id: 'login', label: 'Log in' },
  ];
  const tabRefs = useRef({});

  const onTabKey = (e) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const next = mode === 'signup' ? 'login' : 'signup';
    const target = e.key === 'Home' ? 'signup' : e.key === 'End' ? 'login' : next;
    setMode(target);
    tabRefs.current[target]?.focus();
  };

  return (
    <div className="auth">
      <div className="auth__tabs" role="tablist" aria-label="Account">
        {tabs.map((t) => (
          <button
            key={t.id}
            ref={(el) => (tabRefs.current[t.id] = el)}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={mode === t.id}
            aria-controls={`panel-${t.id}`}
            tabIndex={mode === t.id ? 0 : -1}
            className="auth__tab"
            onClick={() => setMode(t.id)}
            onKeyDown={onTabKey}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${mode}`} aria-labelledby={`tab-${mode}`} className="auth__panel" key={mode}>
        {mode === 'signup' ? <SignupForm onSwitch={() => setMode('login')} /> : <LoginForm onSwitch={() => setMode('signup')} />}
      </div>
    </div>
  );
}

function ErrorSummary({ form, title }) {
  const { errorList, formError, summaryRef, submitCount } = form;
  if (!submitCount || (!errorList.length && !formError)) return null;
  return (
    <div className="error-summary" role="alert" tabIndex={-1} ref={summaryRef}>
      <p className="error-summary__title">{formError || title}</p>
      {errorList.length > 0 && (
        <ul>
          {errorList.map(([name, msg]) => (
            <li key={name}>
              <a
                href={`#${name}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(name)?.focus();
                }}
              >
                {msg}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SignupForm({ onSwitch }) {
  const { signup } = useAuth();
  const form = useForm({
    initial: { fullName: '', emailAddress: '', password: '' },
    validate: (v) => ({
      fullName: rules.fullName(v.fullName),
      emailAddress: rules.emailAddress(v.emailAddress),
      password: rules.newPassword(v.password),
    }),
    onSubmit: (v) => signup({ ...v, fullName: v.fullName.trim(), emailAddress: v.emailAddress.trim() }),
  });
  const busy = form.status === 'submitting';

  return (
    <form className="auth__form" onSubmit={form.handleSubmit} noValidate aria-describedby="signup-intro">
      <header className="auth__head">
        <h1 className="auth__title">Create an account</h1>
        <p id="signup-intro" className="auth__intro">
          Track print runs, keep your art on file and reorder in a few clicks.
        </p>
      </header>
      <ErrorSummary form={form} title="A few details need another look:" />
      <fieldset className="auth__fields" disabled={busy}>
        <Field label="Full name" autoComplete="name" {...form.field('fullName')} />
        <Field
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          spellCheck={false}
          {...form.field('emailAddress')}
        />
        <Field
          label="Password"
          type="password"
          autoComplete="new-password"
          hint="At least 8 characters."
          {...form.field('password')}
        />
      </fieldset>
      <button type="submit" className="btn btn--block" aria-disabled={busy || undefined}>
        {busy ? (
          <>
            <Spinner /> Creating your account…
          </>
        ) : (
          <>
            Create account <ArrowRight size={16} aria-hidden="true" />
          </>
        )}
      </button>
      <p className="auth__switch">
        Already have an account?{' '}
        <button type="button" className="text-btn" onClick={onSwitch}>
          Log in
        </button>
      </p>
    </form>
  );
}

function LoginForm({ onSwitch }) {
  const { login } = useAuth();
  const form = useForm({
    initial: { emailAddress: '', password: '' },
    validate: (v) => ({ emailAddress: rules.emailAddress(v.emailAddress), password: rules.password(v.password) }),
    onSubmit: (v) => login({ emailAddress: v.emailAddress.trim(), password: v.password }),
  });
  const busy = form.status === 'submitting';

  return (
    <form className="auth__form" onSubmit={form.handleSubmit} noValidate>
      <header className="auth__head">
        <h1 className="auth__title">Welcome back</h1>
        <p className="auth__intro">Log in to see your orders and saved art.</p>
      </header>
      <ErrorSummary form={form} title="A few details need another look:" />
      <fieldset className="auth__fields" disabled={busy}>
        <Field
          label="Email"
          type="email"
          autoComplete="username"
          inputMode="email"
          spellCheck={false}
          {...form.field('emailAddress')}
        />
        <Field label="Password" type="password" autoComplete="current-password" {...form.field('password')} />
      </fieldset>
      <button type="submit" className="btn btn--block" aria-disabled={busy || undefined}>
        {busy ? (
          <>
            <Spinner /> Logging in…
          </>
        ) : (
          <>
            Log in <ArrowRight size={16} aria-hidden="true" />
          </>
        )}
      </button>
      {USE_MOCKS && (
        <p className="auth__demo">
          Preview mode, no real accounts. Try <strong>{DEMO_USER.emailAddress}</strong> with{' '}
          <strong>{DEMO_USER.password}</strong>.
        </p>
      )}
      <p className="auth__switch">
        New to DNA?{' '}
        <button type="button" className="text-btn" onClick={onSwitch}>
          Create an account
        </button>
      </p>
    </form>
  );
}

/* ── Signed in ────────────────────────────────────────────────────── */
function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const headingRef = useRef(null);
  const form = useForm({
    initial: { fullName: user.fullName },
    validate: (v) => ({ fullName: rules.fullName(v.fullName) }),
    onSubmit: (v) => updateProfile({ fullName: v.fullName.trim() }),
  });
  const busy = form.status === 'submitting';
  const unchanged = form.values.fullName.trim() === user.fullName;

  // Arriving here right after signing in: announce it by moving focus.
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const since = new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' });

  return (
    <div className="profile">
      <header className="auth__head">
        <p className="eyebrow">Your account</p>
        <h1 className="auth__title" tabIndex={-1} ref={headingRef}>
          Welcome, {user.fullName.split(' ')[0]}.
        </h1>
      </header>

      <dl className="profile__details">
        <div>
          <dt>Email</dt>
          <dd>{user.emailAddress}</dd>
        </div>
        <div>
          <dt>Member since</dt>
          <dd>{since}</dd>
        </div>
      </dl>

      <form className="auth__form" onSubmit={form.handleSubmit} noValidate>
        <h2 className="profile__h">Your details</h2>
        <ErrorSummary form={form} title="A few details need another look:" />
        <fieldset className="auth__fields" disabled={busy}>
          <Field label="Full name" autoComplete="name" {...form.field('fullName')} />
        </fieldset>
        <div className="profile__actions">
          <button type="submit" className="btn" aria-disabled={busy || unchanged || undefined} disabled={unchanged && !busy}>
            {busy ? (
              <>
                <Spinner /> Saving…
              </>
            ) : (
              'Save changes'
            )}
          </button>
          <p className="profile__status" role="status">
            {form.status === 'success' ? 'Saved.' : ''}
          </p>
        </div>
      </form>

      <div className="profile__foot">
        <Link to="/designs" className="link-arrow">
          Browse designs <ArrowRight size={14} aria-hidden="true" />
        </Link>
        <button type="button" className="btn btn--ghost" onClick={logout}>
          <SignOut size={16} aria-hidden="true" /> Log out
        </button>
      </div>
    </div>
  );
}
