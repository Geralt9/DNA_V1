import { useCallback, useRef, useState } from 'react';
import { ApiError } from '../services/api.js';

/**
 * Small form state machine.
 *  - Validates a field when it loses focus, then live once it has shown an error
 *    (no shouting at people while they type for the first time).
 *  - On submit: validates everything, moves focus to the summary if anything fails.
 *  - Maps ApiError.fieldErrors onto fields; anything else becomes `formError`.
 * status: 'idle' | 'submitting' | 'success'
 */
export function useForm({ initial, validate, onSubmit }) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle');
  const [formError, setFormError] = useState(null);
  const [submitCount, setSubmitCount] = useState(0);
  const summaryRef = useRef(null);

  const fieldError = useCallback((name, vals) => validate(vals)[name], [validate]);

  const onChange = (e) => {
    const { name, value } = e.target;
    const next = { ...values, [name]: value };
    setValues(next);
    if (status === 'success') setStatus('idle');
    if (touched[name] || submitCount > 0) setErrors((er) => ({ ...er, [name]: fieldError(name, next) }));
  };

  const onBlur = (e) => {
    const { name } = e.target;
    // Don't flag an untouched empty field just because focus passed through it.
    if (!values[name] && !submitCount) return;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((er) => ({ ...er, [name]: fieldError(name, values) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'submitting') return;
    setSubmitCount((n) => n + 1);
    setFormError(null);
    const all = validate(values);
    const invalid = Object.keys(all).filter((k) => all[k]);
    setErrors(all);
    if (invalid.length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setStatus('submitting');
    try {
      await onSubmit(values);
      setStatus('success');
    } catch (err) {
      setStatus('idle');
      if (err instanceof ApiError && Object.keys(err.fieldErrors).length) {
        setErrors((er) => ({ ...er, ...err.fieldErrors }));
      }
      setFormError(err?.message || 'Something went wrong. Try again in a moment.');
      requestAnimationFrame(() => summaryRef.current?.focus());
    }
  };

  const errorList = Object.entries(errors).filter(([, v]) => v);

  /** Props for an input: value, handlers, a11y wiring. */
  const field = (name) => ({
    name,
    id: name,
    value: values[name],
    onChange,
    onBlur,
    'aria-invalid': errors[name] ? true : undefined,
    error: errors[name],
  });

  return { values, setValues, errors, errorList, formError, status, field, handleSubmit, summaryRef, submitCount };
}

/* Rules mirror Server/validators/auth.schema.js */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const rules = {
  fullName(v) {
    const t = v.trim();
    if (!t) return 'Enter your full name.';
    if (t.length < 2) return 'Use at least 2 characters.';
    if (t.length > 100) return 'Keep it under 100 characters.';
    return undefined;
  },
  emailAddress(v) {
    if (!v.trim()) return 'Enter your email address.';
    if (!EMAIL.test(v.trim())) return 'Enter an email like name@example.com.';
    return undefined;
  },
  newPassword(v) {
    if (!v) return 'Choose a password.';
    if (v.length < 8) return `Use at least 8 characters (${8 - v.length} more).`;
    if (v.length > 72) return 'Keep it to 72 characters or fewer.';
    return undefined;
  },
  password(v) {
    return v ? undefined : 'Enter your password.';
  },
};
