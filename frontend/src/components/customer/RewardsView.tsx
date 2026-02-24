import React from 'react';
import { Gift, Copy, TrendingUp, Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import type { UserProfileResponse } from '../../backend';
import { toast } from 'sonner';

interface RewardsViewProps {
  userProfile: UserProfileResponse | null;
}

const MOCK_TRANSACTIONS = [
  { id: '1', type: 'credit' as const, amount: 100, description: 'Referral reward', date: '2026-02-20' },
  { id: '2', type: 'debit' as const, amount: 499, description: 'Booking payment', date: '2026-02-18' },
  { id: '3', type: 'credit' as const, amount: 50, description: 'Welcome bonus', date: '2026-02-15' },
];

export default function RewardsView({ userProfile }: RewardsViewProps) {
  const walletBalance = userProfile ? Number(userProfile.walletBalance) : 0;
  const referralCode = userProfile?.referralCode ?? 'REF------';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success('Referral code copied!');
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      <div className="gradient-primary px-4 pt-10 pb-6">
        <h1 className="text-xl font-bold text-white">Rewards & Wallet</h1>
        <p className="text-white/70 text-sm mt-1">Earn rewards on every booking</p>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Wallet Balance */}
        <div className="gradient-primary rounded-2xl p-5 shadow-card-lg text-white">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-4 h-4 text-white/80" />
            <p className="text-white/80 text-xs font-medium uppercase tracking-wide">Wallet Balance</p>
          </div>
          <p className="text-4xl font-bold">₹{walletBalance}</p>
          <p className="text-white/70 text-xs mt-1">Available for your next booking</p>
        </div>

        {/* Referral Card */}
        <div className="bg-card rounded-2xl p-4 border border-border shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Gift className="w-4 h-4 text-accent" />
            <h3 className="font-semibold text-sm text-foreground">Your Referral Code</h3>
          </div>
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gradient tracking-widest">{referralCode}</p>
              <p className="text-xs text-muted-foreground mt-1">Share & earn ₹100 per referral</p>
            </div>
            <button
              onClick={handleCopyCode}
              className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-card"
            >
              <Copy className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Referral Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-2xl p-4 border border-border shadow-xs text-center">
            <p className="text-2xl font-bold text-primary">3</p>
            <p className="text-xs text-muted-foreground mt-1">Friends Referred</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border shadow-xs text-center">
            <p className="text-2xl font-bold text-accent">₹300</p>
            <p className="text-xs text-muted-foreground mt-1">Total Rewards</p>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-primary/5 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">How it works</h3>
          </div>
          <div className="space-y-2">
            {[
              '1. Share your referral code with friends',
              '2. Friend books their first service',
              '3. You earn ₹100 wallet credit',
            ].map((step) => (
              <p key={step} className="text-xs text-muted-foreground">{step}</p>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-card rounded-2xl p-4 border border-border shadow-xs">
          <h3 className="font-semibold text-sm text-foreground mb-3">Transaction History</h3>
          <div className="space-y-3">
            {MOCK_TRANSACTIONS.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  tx.type === 'credit' ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  {tx.type === 'credit'
                    ? <ArrowDownLeft className="w-4 h-4 text-green-600" />
                    : <ArrowUpRight className="w-4 h-4 text-red-500" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
                <span className={`text-sm font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                  {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
