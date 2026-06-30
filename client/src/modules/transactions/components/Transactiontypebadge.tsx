import type { TransactionType } from '../Transactiontypes';

export function TransactionTypeBadge({ type }: { type: TransactionType }) {
  const isCredit = type === 'CREDIT';
  return (
    <span className={[
      'inline-flex items-center gap-1 font-sans text-[10px] font-semibold uppercase tracking-wider',
      isCredit ? 'text-emerald-600' : 'text-red-500',
    ].join(' ')}>
      {/* Arrow icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="size-3"
      >
        {isCredit
          ? <path fillRule="evenodd" d="M8 14a.75.75 0 0 1-.75-.75V4.56L4.03 7.78a.75.75 0 0 1-1.06-1.06l4.5-4.5a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06L8.75 4.56v8.69A.75.75 0 0 1 8 14Z" clipRule="evenodd" />
          : <path fillRule="evenodd" d="M8 2a.75.75 0 0 1 .75.75v8.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.22 3.22V2.75A.75.75 0 0 1 8 2Z" clipRule="evenodd" />
        }
      </svg>
      {isCredit ? 'Credit' : 'Debit'}
    </span>
  );
}