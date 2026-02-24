import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useSaveAddress } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AddAddressModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddAddressModal({ open, onClose }: AddAddressModalProps) {
  const { identity } = useInternetIdentity();
  const saveAddress = useSaveAddress();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
    isDefault: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) return;

    if (!form.name || !form.addressLine1 || !form.city || !form.state || !form.zip) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await saveAddress.mutateAsync({
        id: BigInt(Date.now()),
        userId: identity.getPrincipal(),
        name: form.name,
        phone: form.phone,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2,
        city: form.city,
        state: form.state,
        zip: form.zip,
        isDefault: form.isDefault,
      });
      toast.success('Address saved!');
      setForm({ name: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', zip: '', isDefault: false });
      onClose();
    } catch {
      toast.error('Failed to save address');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Address</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Label *</Label>
              <Input placeholder="Home / Work" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl h-10" required />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Phone</Label>
              <Input type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-xl h-10" />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Address Line 1 *</Label>
            <Input placeholder="House/Flat No., Street" value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} className="rounded-xl h-10" required />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Address Line 2</Label>
            <Input placeholder="Area, Landmark" value={form.addressLine2} onChange={(e) => setForm({ ...form, addressLine2: e.target.value })} className="rounded-xl h-10" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">City *</Label>
              <Input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-xl h-10" required />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">State *</Label>
              <Input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="rounded-xl h-10" required />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">ZIP *</Label>
              <Input placeholder="ZIP" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} className="rounded-xl h-10" required />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="isDefault"
              checked={form.isDefault}
              onCheckedChange={(checked) => setForm({ ...form, isDefault: !!checked })}
            />
            <Label htmlFor="isDefault" className="text-sm cursor-pointer">Set as default address</Label>
          </div>
          <Button type="submit" className="w-full h-11 rounded-xl gradient-primary text-white border-0" disabled={saveAddress.isPending}>
            {saveAddress.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : 'Save Address'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
