import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSaveCallerUserProfile } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { UserRole } from '../../backend';
import { Loader2, User } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileSetupModalProps {
  open: boolean;
  onComplete: () => void;
}

export default function ProfileSetupModal({ open, onComplete }: ProfileSetupModalProps) {
  const { identity } = useInternetIdentity();
  const saveProfile = useSaveCallerUserProfile();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) return;

    if (!form.firstName.trim() || !form.phone.trim()) {
      toast.error('Please fill in required fields');
      return;
    }

    const now = BigInt(Date.now()) * BigInt(1_000_000);
    const referralCode = `REF${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    try {
      await saveProfile.mutateAsync({
        principal: identity.getPrincipal(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        role: UserRole.user,
        referralCode,
        walletBalance: BigInt(0),
        savedAddresses: [],
        blocked: false,
        createdAt: now,
        updatedAt: now,
      });
      toast.success('Profile created successfully!');
      onComplete();
    } catch (err) {
      toast.error('Failed to save profile. Please try again.');
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="rounded-2xl max-w-sm mx-auto" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-2">
            <User className="w-6 h-6 text-white" />
          </div>
          <DialogTitle className="text-center text-xl">Complete Your Profile</DialogTitle>
          <DialogDescription className="text-center text-sm">
            Tell us a bit about yourself to get started
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="firstName" className="text-xs font-medium">First Name *</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="rounded-xl h-10"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName" className="text-xs font-medium">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="rounded-xl h-10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs font-medium">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="rounded-xl h-10"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-xl h-10"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 rounded-xl gradient-primary text-white font-semibold border-0"
            disabled={saveProfile.isPending}
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Get Started'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
