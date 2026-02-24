import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface BookingNotesEntryProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function BookingNotesEntry({
  notes,
  onNotesChange,
  onBack,
  onContinue,
}: BookingNotesEntryProps) {
  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="gradient-primary px-4 pt-10 pb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-white/80 mb-4 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
        <h1 className="text-xl font-bold text-white">Add Notes</h1>
        <p className="text-white/70 text-sm mt-1">Any special instructions for the technician?</p>
      </div>

      <div className="px-4 pt-4 space-y-4">
        <div className="bg-card rounded-2xl p-4 border border-border shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">Special Instructions</h3>
          </div>
          <Textarea
            placeholder="E.g., Please bring extra tools, the issue is with the main pipe under the sink..."
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            className="rounded-xl min-h-[120px] resize-none border-border"
          />
          <p className="text-xs text-muted-foreground mt-2">{notes.length}/500 characters</p>
        </div>

        <div className="bg-primary/5 rounded-2xl p-4">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Tip:</strong> Providing clear instructions helps the technician come prepared and complete the job faster.
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile px-4 pb-6 pt-3 bg-background/95 backdrop-blur-sm border-t border-border">
        <Button onClick={onContinue} className="w-full h-12 rounded-xl gradient-primary text-white font-semibold border-0">
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}
