import { useState } from 'react';
import { Eye, EyeSlash, WarningDiamond } from '@phosphor-icons/react';
import './Field.css';

/**
 * Labelled input with hint + error, wired with aria-describedby.
 * Errors carry an icon and text, so meaning never rests on colour.
 */
export default function Field({ label, hint, error, type = 'text', id, className = '', ...input }) {
  const [reveal, setReveal] = useState(false);
  const isPassword = type === 'password';
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`field ${className}`} data-invalid={error ? true : undefined}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className="field__control">
        <input
          id={id}
          type={isPassword && reveal ? 'text' : type}
          className="field__input"
          aria-describedby={describedBy}
          {...input}
        />
        {isPassword && (
          <button
            type="button"
            className="field__reveal"
            onClick={() => setReveal((r) => !r)}
            aria-label={reveal ? 'Hide password' : 'Show password'}
            aria-pressed={reveal}
            aria-controls={id}
          >
            {reveal ? <EyeSlash size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
          </button>
        )}
      </div>
      {error && (
        <p className="field__error" id={errorId}>
          <WarningDiamond size={16} weight="fill" aria-hidden="true" />
          {error}
        </p>
      )}
      {hint && (
        <p className="field__hint" id={hintId}>
          {hint}
        </p>
      )}
    </div>
  );
}
