export const bankName = 'Saathi Bank of India';

export const publicHighlights = [
  { label: 'Digital Uptime', value: '99.99%' },
  { label: 'UPI Transactions Today', value: '4.8M+' },
  { label: 'Customer Satisfaction', value: '4.95/5' }
];

export const featureCards = [
  {
    title: 'Retail & Corporate Banking',
    description: 'Check balances, download statements, transfer funds via UPI/IMPS/NEFT/RTGS, and manage scheduled payments seamlessly.'
  },
  {
    title: 'Card and Account Controls',
    description: 'Instantly block debit/credit cards, manage domestic & international transaction limits, and secure your accounts.'
  },
  {
    title: 'UPI & Fast Payments',
    description: 'Transfer funds instantly using BHIM UPI, IMPS, or set up e-mandates and standing instructions with instant verification.'
  },
  {
    title: 'Digital Safety & Support',
    description: 'Access 24x7 security support, report cyber fraud directly, and lock/unlock your internet banking access instantly.'
  }
];

export const loginBenefits = [
  'Secure sign-in with 2FA OTP and device binding.',
  'Access to Digital Rupee (e-Rupee) and banking products.',
  'Robust anti-coercion & behavioral security protocols.'
];

export const dashboardStats = [
  { label: 'Available Balance', value: '₹3,41,820.00', hint: 'Across linked accounts' },
  { label: 'Scheduled Payments', value: '4', hint: 'Next in the morning batch' },
  { label: 'Saved Beneficiaries', value: '18', hint: 'Verified & active' },
  { label: 'Active Cards', value: '2', hint: '1 Debit (RuPay), 1 Credit (Visa)' }
];

export const accountCards = [
  {
    name: 'Savings Bank Account',
    number: '•• 4821',
    balance: '₹2,48,300.18',
    status: 'Primary Account (SB-102)',
    tone: 'emerald'
  },
  {
    name: 'Current Operative Account',
    number: '•• 7310',
    balance: '₹93,520.00',
    status: 'Linked Operating Account',
    tone: 'slate'
  },
  {
    name: 'Flexi Fixed Deposit',
    number: '•• 1149',
    balance: '₹1,00,000.00',
    status: 'Auto-renewal active',
    tone: 'gold'
  }
];

export const recentActivity = [
  {
    date: '22 May',
    title: 'UPI Transfer to Priya Sharma',
    amount: '-₹18,500.00',
    status: 'Completed',
    detail: 'Ref: UPI/614392810471'
  },
  {
    date: '22 May',
    title: 'Salary Credit - Axis Studio LLP',
    amount: '+₹96,200.00',
    status: 'Completed',
    detail: 'Ref: NEFT/AXISN2614920'
  },
  {
    date: '21 May',
    title: 'IMPS Transfer to Vivek Traders',
    amount: '-₹25,000.00',
    status: 'Pending',
    detail: 'Under verification check'
  },
  {
    date: '21 May',
    title: 'Electricity Bill - BESCOM',
    amount: '-₹4,820.00',
    status: 'Completed',
    detail: 'Ref: BBPS/BS8210982'
  }
];

export const payees = [
  { name: 'Priya Sharma', account: 'UPI: priya.sharma@upi', bank: 'State Bank of India (SBIN0001243)', label: 'Verified' },
  { name: 'Vivek Traders', account: 'A/c: 004821774512 (IFSC: ICIC0000048)', bank: 'ICICI Bank Ltd', label: 'Active' },
  { name: 'Maya Fernandes', account: 'A/c: 1872210901 (IFSC: HDFC0000287)', bank: 'HDFC Bank Ltd', label: 'Verified' },
  { name: 'Rohan Mehta', account: 'UPI: rohan.mehta@okaxis', bank: 'Axis Bank Ltd', label: 'Trusted' }
];

export const cardPortfolio = [
  {
    name: 'Saathi RuPay Platinum Debit',
    number: '•• 2287',
    limit: 'Daily Limit: ₹1,50,000.00',
    status: 'Active'
  },
  {
    name: 'Saathi Select Credit Card',
    number: '•• 6643',
    limit: 'Outstanding: ₹24,860.00',
    status: 'Statement Due: 3 Jun'
  }
];

export const securityItems = [
  'Multi-factor OTP authentication is enabled for all transactions above ₹10,000.',
  'Device trust binding is active for your registered primary mobile number.',
  'Real-time behavioral security engine (Saathi SDK) is active on this session.',
  'Automatic logout warning will trigger after 5 minutes of inactivity.'
];

export const supportTopics = [
  { title: 'Block Debit / Credit Card', detail: 'Freeze your card instantly in the Cards tab or call emergency support at 1800-11-2211.' },
  { title: 'Report Cyber Fraud (1930)', detail: 'Directly file claims for unauthorized payment operations within 24 hours to recover funds.' },
  { title: 'Update Aadhaar & PAN Card', detail: 'Submit KYC updates online through secure Aadhaar OTP verification.' },
  { title: 'UPI Limit & PIN Reset', detail: 'Reset UPI PIN or raise daily limits for safe merchant transfers.' }
];

export const fraudAlerts = [
  { label: 'Session Security', value: 'Enabled', detail: 'Behavior monitoring active' },
  { label: 'Registered Payees', value: '18', detail: 'Trusted list verified' },
  { label: 'Card Controls', value: 'Active', detail: 'Limits locked' },
  { label: 'Fraud Helpline', value: '1930', detail: 'Emergency reporting ready' }
];

export const statementRows = [
  { ref: 'TXN-9911', date: '22 May 2026', beneficiary: 'Priya Sharma', amount: '-₹18,500.00', status: 'Completed' },
  { ref: 'TXN-9912', date: '22 May 2026', beneficiary: 'Axis Studio LLP', amount: '+₹96,200.00', status: 'Completed' },
  { ref: 'TXN-9913', date: '21 May 2026', beneficiary: 'Vivek Traders', amount: '-₹25,000.00', status: 'Pending' },
  { ref: 'TXN-9914', date: '21 May 2026', beneficiary: 'Electricity Board (BESCOM)', amount: '-₹4,820.00', status: 'Completed' },
  { ref: 'TXN-9915', date: '20 May 2026', beneficiary: 'Maya Fernandes', amount: '-₹7,250.00', status: 'Scheduled' }
];
