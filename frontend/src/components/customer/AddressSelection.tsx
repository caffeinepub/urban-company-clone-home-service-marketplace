import React, { useState } from 'react';
import { ArrowLeft, MapPin, Plus, CheckCircle } from 'lucide-react';
import { useListAddresses, useSetDefaultAddress } from '../../hooks/useQueries';
import type { Address } from '../../backend';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import AddAddressModal from './AddAddressModal';

interface AddressSelectionProps {
  selectedAddress: Address | null;
  onSelectAddress: (address: Address) => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function AddressSelection({
  selectedAddress,
  onSelectAddress,
  onBack,
  onContinue,
}: AddressSelectionProps) {
  const { data: addresses, isLoading } = useListAddresses();
  const setDefault = useSetDefaultAddress();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="gradient-primary px-4 pt-10 pb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-white/80 mb-4 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
        <h1 className="text-xl font-bold text-white">Select Address</h1>
        <p className="text-white/70 text-sm mt-1">Where should the technician come?</p>
      </div>

      <div className="px-4 pt-4 space-y-3">
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full flex items-center gap-3 p-4 bg-primary/5 border-2 border-dashed border-primary/30 rounded-2xl hover:bg-primary/10 transition-colors"
        >
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium text-primary">Add New Address</span>
        </button>

        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
        ) : addresses && addresses.length > 0 ? (
          addresses.map((address) => (
            <AddressCard
              key={address.id.toString()}
              address={address}
              isSelected={selectedAddress?.id === address.id}
              onSelect={() => onSelectAddress(address)}
              onSetDefault={() => setDefault.mutate(address.id)}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No saved addresses</p>
            <p className="text-xs text-muted-foreground mt-1">Add an address to continue</p>
          </div>
        )}
      </div>

      {selectedAddress && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile px-4 pb-6 pt-3 bg-background/95 backdrop-blur-sm border-t border-border">
          <Button onClick={onContinue} className="w-full h-12 rounded-xl gradient-primary text-white font-semibold border-0">
            Continue with this address
          </Button>
        </div>
      )}

      <AddAddressModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}

function AddressCard({
  address,
  isSelected,
  onSelect,
  onSetDefault,
}: {
  address: Address;
  isSelected: boolean;
  onSelect: () => void;
  onSetDefault: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`bg-card rounded-2xl p-4 border-2 cursor-pointer transition-all shadow-xs ${
        isSelected ? 'border-primary shadow-card' : 'border-border hover:border-primary/30'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? 'gradient-primary' : 'bg-muted'}`}>
          <MapPin className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-muted-foreground'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm text-foreground">{address.name}</p>
            {address.isDefault && (
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Default</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}, {address.city}, {address.state} - {address.zip}
          </p>
          {address.phone && <p className="text-xs text-muted-foreground mt-0.5">{address.phone}</p>}
        </div>
        {isSelected && <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />}
      </div>
      {!address.isDefault && (
        <button
          onClick={(e) => { e.stopPropagation(); onSetDefault(); }}
          className="mt-2 text-xs text-primary hover:text-primary/80 transition-colors"
        >
          Set as default
        </button>
      )}
    </div>
  );
}
