import { BankLayout } from '@/components/layout/BankLayout';
import { TransferForm } from '@/components/banking/TransferForm';

export default function TransferPage() {
  return (
    <BankLayout>
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <TransferForm />
      </main>
    </BankLayout>
  );
}
