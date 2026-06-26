import { type ButtonHTMLAttributes, forwardRef } from 'react';

// ─── Variants ─────────────────────────────────────────────────────────────────

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'muted'
  | 'danger';

type ButtonSize = 'sm' | 'md' | 'lg';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  ButtonVariant;
  size?:     ButtonSize;
  loading?:  boolean;
  fullWidth?: boolean;
}

// ─── Style maps ───────────────────────────────────────────────────────────────

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white shadow-primary ' +
    'hover:bg-primary-600 active:bg-primary-700 ' +
    'disabled:bg-primary/50',

  secondary:
    'bg-dark text-white ' +
    'hover:bg-dark-400 active:bg-dark-500 ' +
    'disabled:bg-dark/40',

  outline:
    'bg-transparent border border-dark/20 text-dark ' +
    'hover:bg-dark/5 active:bg-dark/10 ' +
    'disabled:border-dark/10 disabled:text-dark/40',

  muted:
    'bg-neutral-bg-soft text-neutral-text-muted ' +
    'hover:bg-dark/5 active:bg-dark/10 ' +
    'disabled:text-dark/30',

  danger:
    'bg-red-500 text-white ' +
    'hover:bg-red-600 active:bg-red-700 ' +
    'disabled:bg-red-300',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8  px-3.5 text-xs  gap-1.5',
  md: 'h-10 px-5   text-sm  gap-2',
  lg: 'h-12 px-6   text-base gap-2.5',
};

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner({ size }: { size: ButtonSize }) {
  const dim = size === 'sm' ? 'size-3' : size === 'md' ? 'size-4' : 'size-5';
  return (
    <svg
      className={`${dim} animate-spin`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant   = 'primary',
      size      = 'md',
      loading   = false,
      fullWidth = false,
      disabled,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={[
          // Base
          'inline-flex items-center justify-center',
          'font-sans font-semibold rounded-lg',
          'transition-all duration-150 cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:shadow-none',
          // Variant + size
          variantStyles[variant],
          sizeStyles[size],
          // Width
          fullWidth ? 'w-full' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {/* {loading && <Spinner size={size} />} */}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';