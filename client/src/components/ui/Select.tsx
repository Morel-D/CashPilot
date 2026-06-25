import { forwardRef, type SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?:   string;
  error?:   string;
  hint?:    string;
  options:  SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, id, className = '', ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5 w-full">

        {label && (
          <label
            htmlFor={selectId}
            className="font-sans text-xs font-medium text-dark/70 select-none"
          >
            {label}
            {props.required && (
              <span className="ml-0.5 text-primary" aria-hidden="true">*</span>
            )}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            className={[
              'w-full h-10 rounded-lg bg-white appearance-none',
              'font-sans text-sm text-dark',
              'border transition-all duration-150 outline-none',
              'pl-3.5 pr-9',
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-dark/15 focus:border-primary focus:ring-2 focus:ring-primary/20',
              'disabled:bg-neutral-bg-soft disabled:text-neutral-text-muted disabled:cursor-not-allowed',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Chevron */}
          <span className="absolute right-3 pointer-events-none text-neutral-text-muted">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </span>
        </div>

        {error ? (
          <p className="font-sans text-xs text-red-500">{error}</p>
        ) : hint ? (
          <p className="font-sans text-xs text-neutral-text-muted">{hint}</p>
        ) : null}

      </div>
    );
  }
);

Select.displayName = 'Select';