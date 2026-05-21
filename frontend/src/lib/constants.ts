export const bankName = 'Northfield Bank';

export const publicHighlights = [
  { label: 'Digital uptime', value: '99.98%' },
  { label: 'Payments processed', value: '1.2M+' },
  { label: 'Customer rating', value: '4.9/5' }
];

export const featureCards = [
  {
    title: 'Everyday banking',
    description: 'View balances, move money between accounts, and manage scheduled payments from a single dashboard.'
  },
  {
    title: 'Card and account controls',
    description: 'Freeze cards, raise limits, review device activity, and keep account preferences close at hand.'
  },
  {
    title: 'Payments and payees',
    description: 'Send transfers through UPI, IMPS, NEFT, or scheduled instructions with payee verification.'
  },
  {
    title: 'Statements and support',
    description: 'Download statements, open service requests, and reach support without leaving the secure session.'
  }
];

export const loginBenefits = [
  'Secure sign-in with OTP and device trust.',
  'Access to accounts, cards, payments, and statements.',
  'Always-on support and self-service settings.'
];

export const dashboardStats = [
  { label: 'Available balance', value: 'INR 3,41,820', hint: 'Across linked accounts' },
  { label: 'Scheduled payments', value: '4', hint: 'Next in the morning batch' },
  { label: 'Saved payees', value: '18', hint: 'Verified and active' },
  { label: 'Cards in use', value: '2', hint: '1 debit, 1 credit' }
];

export const accountCards = [
  {
    name: 'Everyday Current',
    number: '•• 4821',
    balance: 'INR 2,48,300.18',
    status: 'Primary operating account',
    tone: 'emerald'
  },
  {
    name: 'Wealth Savings',
    number: '•• 7310',
    balance: 'INR 93,520.00',
    status: 'Linked savings account',
    tone: 'slate'
  },
  {
    name: 'Flexi Deposit',
    number: '•• 1149',
    balance: 'INR 1,00,000.00',
    status: 'Auto-renewing deposit',
    tone: 'gold'
  }
];

export const recentActivity = [
  {
    date: '22 May',
    title: 'UPI transfer to Priya Sharma',
    amount: '-INR 18,500',
    status: 'Completed',
    detail: 'Northfield UPI rail'
  },
  {
    date: '22 May',
    title: 'Salary credit from Axis Studio LLP',
    amount: '+INR 96,200',
    status: 'Completed',
    detail: 'Automated inward transfer'
  },
  {
    date: '21 May',
    title: 'IMPS transfer to Vivek Traders',
    amount: '-INR 25,000',
    status: 'Pending',
    detail: 'Scheduled after verification'
  },
  {
    date: '21 May',
    title: 'Bill payment - electricity',
    amount: '-INR 4,820',
    status: 'Completed',
    detail: 'Auto-debit enabled'
  }
];

export const payees = [
  { name: 'Priya Sharma', account: 'UPI priya.sharma@upi', bank: 'Northfield Bank', label: 'Verified' },
  { name: 'Vivek Traders', account: 'IMPS 004821774512', bank: 'National Payments', label: 'Active' },
  { name: 'Maya Fernandes', account: 'NEFT 1872210901', bank: 'Northfield Bank', label: 'Verified' },
  { name: 'Rohan Mehta', account: 'UPI rohan.mehta@upi', bank: 'Green Valley Bank', label: 'Trusted' }
];

export const cardPortfolio = [
  {
    name: 'Northfield Platinum Debit',
    number: '•• 2287',
    limit: 'Daily limit INR 1,50,000',
    status: 'Active'
  },
  {
    name: 'Northfield Select Credit',
    number: '•• 6643',
    limit: 'Outstanding INR 24,860',
    status: 'Statement due 3 Jun'
  }
];

export const securityItems = [
  'Two-factor authentication is enabled for payments above your set threshold.',
  'Trusted device history shows the last five sign-ins.',
  'A spending alert is active for card and transfer activity.',
  'Session timeout is set to 10 minutes on shared devices.'
];

export const supportTopics = [
  { title: 'Lost or stolen card', detail: 'Freeze the card and request a replacement from the support desk.' },
  { title: 'Payment not received', detail: 'Track IMPS, NEFT, and UPI references from the statements page.' },
  { title: 'Change mobile number', detail: 'Update your profile and confirm the change with an OTP.' },
  { title: 'Need branch help', detail: 'Use branch locator, call support, or schedule a callback.' }
];

export const fraudAlerts = [
  { label: 'Session security', value: 'Enabled', detail: 'Two-factor login active' },
  { label: 'Saved payees', value: '18', detail: 'Verified recipients' },
  { label: 'Card controls', value: 'Active', detail: 'Freeze and limit settings ready' },
  { label: 'Alerts', value: 'On', detail: 'Large transfers and card spending' }
];

export const statementRows = [
  { ref: 'TXN-9911', date: '22 May 2026', beneficiary: 'Priya Sharma', amount: '-INR 18,500', status: 'Completed' },
  { ref: 'TXN-9912', date: '22 May 2026', beneficiary: 'Axis Studio LLP', amount: '+INR 96,200', status: 'Completed' },
  { ref: 'TXN-9913', date: '21 May 2026', beneficiary: 'Vivek Traders', amount: '-INR 25,000', status: 'Pending' },
  { ref: 'TXN-9914', date: '21 May 2026', beneficiary: 'Electricity Board', amount: '-INR 4,820', status: 'Completed' },
  { ref: 'TXN-9915', date: '20 May 2026', beneficiary: 'Maya Fernandes', amount: '-INR 7,250', status: 'Scheduled' }
];
