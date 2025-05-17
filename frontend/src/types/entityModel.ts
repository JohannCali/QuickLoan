
// Entity type definitions for the lending protocol

export interface User {
  user_id: string;
  name: string;
  email: string;
  creation_date: Date;
  country: string;
}

export interface Wallet {
  wallet_id: string;
  user_id: string;
  address: string;
  date_creation: Date;
  type: 'EOA' | 'Smart Contract' | 'Multi-Sig';
  status: 'Active' | 'Inactive';
}

export interface Asset {
  asset_id: string;
  name: string;
  symbol: string;
  type: 'Native' | 'ERC20' | 'Stablecoin';
  current_price: number;
  logo_url: string;
  apy: number; // Annual Percentage Yield
  total_supply: number;
  total_borrowed: number;
}

export interface Collateral {
  collateral_id: string;
  loan_id: string;
  asset_id: string;
  amount: number;
  deposit_date: Date;
  ltv_ratio: number; // Loan-to-Value ratio
}

export interface Loan {
  loan_id: string;
  user_id: string;
  wallet_id: string;
  amount_borrowed: number;
  amount_remaining: number;
  interest_rate: number;
  start_date: Date;
  due_date: Date;
  status: 'Open' | 'Closed' | 'Default';
}

export interface Repayment {
  repayment_id: string;
  loan_id: string;
  due_date: Date;
  amount_due: number;
  amount_paid: number;
  payment_date: Date | null;
  late: boolean;
  penalty: number;
}

export interface OnChainActivity {
  activity_id: string;
  wallet_id: string;
  date: Date;
  type: 'Transfer' | 'Loan' | 'Swap' | 'Staking';
  amount: number;
  remote_address: string;
  suspicious: boolean;
}

export interface TrustScore {
  trustscore_id: string;
  user_id: string;
  score: number; // 0-100
  calculation_date: Date;
}

export interface BorrowHistory {
  history_id: string;
  user_id: string;
  total_loans: number;
  total_remaining: number;
  default_count: number;
  last_successful_repayment: Date | null;
  last_default: Date | null;
  repayment_rate: number; // 0-100%
}

export interface KYCFile {
  kyc_id: string;
  user_id: string;
  submission_date: Date;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface IdentityDocument {
  doc_id: string;
  kyc_id: string;
  type: 'ID' | 'Passport' | 'Payslip' | 'TaxReturn';
  issue_date: Date;
  expiry_date: Date | null;
  validation_status: 'Pending' | 'Valid' | 'Invalid';
}

export interface RiskScore {
  riskscore_id: string;
  user_id: string;
  score: number; // 300-850, credit score style
  calculation_date: Date;
}

// Staking entity (optional)
export interface Staking {
  stake_id: string;
  user_id: string;
  asset_id: string;
  amount: number;
  start_date: Date;
  duration: number; // in days
  apy: number;
}

// Helper interface for entity relationships
export interface EntityRelationship {
  from: string;
  to: string;
  label: string;
  cardinality: string; // e.g. "1,1", "1,N", etc.
}
