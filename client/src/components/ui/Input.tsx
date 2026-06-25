import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

// ─── Props ────────────────────────────────────────────────────────────────────

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:       string;
  error?:       string;
  hint?:        string;
  leftIcon?:    ReactNode;
  rightElement?: ReactNode; // e.g. show/hide password toggle
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightElement,
      id,
      type,
      className = '',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType  = isPassword ? (showPassword ? 'text' : 'password') : type;
    const inputId    = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5 w-full">

        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="font-sans text-xs font-medium text-dark/70 select-none"
          >
            {label}
            {props.required && (
              <span className="ml-0.5 text-primary" aria-hidden="true">*</span>
            )}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative flex items-center">

          {/* Left icon */}
          {leftIcon && (
            <span className="absolute left-3 text-neutral-text-muted pointer-events-none flex items-center">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={[
              'w-full h-10 rounded-lg bg-white',
              'font-sans text-sm text-dark placeholder:text-neutral-text-muted/70',
              'border transition-all duration-150 outline-none',
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-dark/15 focus:border-primary focus:ring-2 focus:ring-primary/20',
              leftIcon  ? 'pl-9'  : 'pl-3.5',
              (rightElement || isPassword) ? 'pr-10' : 'pr-3.5',
              'disabled:bg-neutral-bg-soft disabled:text-neutral-text-muted disabled:cursor-not-allowed',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            {...props}
          />

          {/* Right: custom element OR password toggle */}
          {(rightElement || isPassword) && (
            <span className="absolute right-3 flex items-center">
              {isPassword && !rightElement ? (
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-neutral-text-muted hover:text-dark transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    // Eye-slash
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    // Eye
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              ) : (
                <span className="text-neutral-text-muted">{rightElement}</span>
              )}
            </span>
          )}
        </div>

        {/* Error or hint */}
        {error ? (
          <p className="font-sans text-xs text-red-500">{error}</p>
        ) : hint ? (
          <p className="font-sans text-xs text-neutral-text-muted">{hint}</p>
        ) : null}

      </div>
    );
  }
);

Input.displayName = 'Input';