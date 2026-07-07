import Toast from './Toast';
import { useToastStore } from './Toaststore';

export function ToastContainer() {
  const { toasts, hide } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>

      {/*
        Mobile  : bottom-3, left/right-3 → full width with small gutter
        Desktop : bottom-6, right-5, fixed width 340px, anchored to right
      */}
      <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-5 sm:bottom-6 z-50 flex flex-col gap-2 sm:w-85">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            {...t}
            onClose={hide}
          />
        ))}
      </div>
    </>
  );
}