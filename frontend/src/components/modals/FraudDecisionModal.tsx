interface FraudDecisionModalProps {
  open: boolean;
  title: string;
  message: string;
  action?: 'ALLOW' | 'WARNING' | 'STEP_UP' | 'BLOCK';
  explanations?: string[];
  onClose?: () => void;
  onProceed?: () => void;
}

export function FraudDecisionModal({
  open,
  title,
  message,
  action = 'BLOCK',
  explanations = [],
  onClose,
  onProceed
}: FraudDecisionModalProps) {
  if (!open) {
    return null;
  }

  const isBlock = action === 'BLOCK' || action === 'STEP_UP';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-6 backdrop-blur-sm animate-fadeIn">
      <div className="max-w-lg w-full rounded-[2rem] bg-white p-8 text-slate-900 shadow-2xl border border-slate-100">
        <div className="flex items-center gap-3">
          <span className={`flex h-10 w-10 items-center justify-center rounded-2xl font-bold ${isBlock ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
            {isBlock ? (
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            )}
          </span>
          <div>
            <p className={`text-xs uppercase tracking-[0.28em] font-bold ${isBlock ? 'text-red-600' : 'text-amber-600'}`}>
              Security Response ({action})
            </p>
            <h2 className="text-2xl font-semibold mt-0.5">{title}</h2>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-600 font-medium">
          {message}
        </p>

        {explanations.length > 0 && (
          <div className="mt-5 rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-2">Detected Risk Indicators</p>
            <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
              {explanations.map((exp, idx) => (
                <li key={idx} className="leading-5">{exp}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-end">
          {isBlock ? (
            <>
              <a
                href="tel:1930"
                className="w-full sm:w-auto text-center rounded-xl bg-red-600 hover:bg-red-700 text-white py-3 px-5 text-sm font-semibold shadow-md shadow-red-200 transition flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call National Helpline (1930)
              </a>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 py-3 px-5 text-sm font-semibold transition"
              >
                Go Back
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-3 px-5 text-sm font-semibold transition"
              >
                Hang Up / Cancel Transfer
              </button>
              {onProceed && (
                <button
                  type="button"
                  onClick={onProceed}
                  className="w-full sm:w-auto rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 py-3 px-5 text-sm font-semibold transition"
                >
                  I understand, proceed
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
