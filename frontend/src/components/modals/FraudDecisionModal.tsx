interface FraudDecisionModalProps {
  open: boolean;
  title: string;
  message: string;
}

export function FraudDecisionModal({ open, title, message }: FraudDecisionModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-6">
      <div className="max-w-lg rounded-3xl bg-white p-8 text-slate-900 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.28em] text-red-600">Fraud response</p>
        <h2 className="mt-3 text-3xl font-semibold">{title}</h2>
        <p className="mt-4 text-slate-600">{message}</p>
      </div>
    </div>
  );
}
