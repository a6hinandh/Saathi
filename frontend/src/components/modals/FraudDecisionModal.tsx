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
            {isBlock ? '⚠️' : '🔔'}
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
                className="w-full sm:w-auto text-center rounded-xl bg-red-600 hover:bg-red-700 text-white py-3 px-5 text-sm font-semibold shadow-md shadow-red-200 transition"
              >
                📞 Call National Helpline (1930)
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
