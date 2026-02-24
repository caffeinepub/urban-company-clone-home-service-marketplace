import React, { useState } from 'react';
import { Plus, CheckCircle, XCircle, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Technician {
  id: string;
  name: string;
  phone: string;
  serviceArea: string;
  commissionRate: number;
  status: 'Active' | 'Suspended' | 'Pending';
  documentsApproved: boolean;
  completedJobs: number;
  rating: number;
}

const MOCK_TECHNICIANS: Technician[] = [
  { id: '1', name: 'Rajesh Kumar', phone: '+91 98765 43210', serviceArea: 'Andheri, Mumbai', commissionRate: 20, status: 'Active', documentsApproved: true, completedJobs: 145, rating: 4.8 },
  { id: '2', name: 'Suresh Patel', phone: '+91 87654 32109', serviceArea: 'Bandra, Mumbai', commissionRate: 20, status: 'Active', documentsApproved: true, completedJobs: 89, rating: 4.6 },
  { id: '3', name: 'Amit Singh', phone: '+91 76543 21098', serviceArea: 'Powai, Mumbai', commissionRate: 20, status: 'Pending', documentsApproved: false, completedJobs: 0, rating: 0 },
  { id: '4', name: 'Deepak Sharma', phone: '+91 65432 10987', serviceArea: 'Thane, Mumbai', commissionRate: 20, status: 'Suspended', documentsApproved: true, completedJobs: 32, rating: 4.2 },
];

export default function TechniciansManagement() {
  const [technicians, setTechnicians] = useState<Technician[]>(MOCK_TECHNICIANS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', serviceArea: '', commissionRate: '20' });
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const rate = Number(form.commissionRate);
    if (rate < 0 || rate > 100) { toast.error('Commission rate must be 0–100'); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    const newTech: Technician = {
      id: Date.now().toString(),
      name: form.name,
      phone: form.phone,
      serviceArea: form.serviceArea,
      commissionRate: rate,
      status: 'Pending',
      documentsApproved: false,
      completedJobs: 0,
      rating: 0,
    };
    setTechnicians(prev => [...prev, newTech]);
    setForm({ name: '', phone: '', serviceArea: '', commissionRate: '20' });
    setSaving(false);
    setShowAddModal(false);
    toast.success('Technician added successfully');
  };

  const approveDocuments = (id: string) => {
    setTechnicians(prev => prev.map(t => t.id === id ? { ...t, documentsApproved: true, status: 'Active' } : t));
    toast.success('Documents approved');
  };

  const toggleSuspend = (id: string) => {
    setTechnicians(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'Suspended' ? 'Active' : 'Suspended' } : t));
    toast.success('Status updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Technician Management</h1>
          <p className="text-muted-foreground text-sm mt-1">{technicians.length} technicians</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="rounded-xl gradient-primary text-white border-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Technician
        </Button>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Name', 'Phone', 'Service Area', 'Status', 'Docs', 'Jobs', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {technicians.map((tech) => (
                <tr key={tech.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <Wrench className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{tech.name}</p>
                        <p className="text-xs text-muted-foreground">{tech.commissionRate}% commission</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{tech.phone}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{tech.serviceArea}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      tech.status === 'Active' ? 'bg-green-50 text-green-600' :
                      tech.status === 'Suspended' ? 'bg-red-50 text-red-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {tech.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {tech.documentsApproved
                      ? <CheckCircle className="w-4 h-4 text-green-600" />
                      : <XCircle className="w-4 h-4 text-muted-foreground" />
                    }
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{tech.completedJobs}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {!tech.documentsApproved && (
                        <Button size="sm" onClick={() => approveDocuments(tech.id)} className="h-7 px-2 text-xs rounded-lg gradient-primary text-white border-0">
                          Approve
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className={`h-7 px-2 text-xs rounded-lg ${tech.status === 'Suspended' ? 'border-green-300 text-green-600' : 'border-destructive/30 text-destructive'}`}>
                            {tech.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>{tech.status === 'Suspended' ? 'Reactivate' : 'Suspend'} Technician?</AlertDialogTitle>
                            <AlertDialogDescription>
                              {tech.status === 'Suspended'
                                ? `${tech.name} will be able to receive jobs again.`
                                : `${tech.name} will not receive any new jobs.`}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => toggleSuspend(tech.id)} className="rounded-xl">Confirm</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Technician Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle>Add New Technician</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-3 mt-2">
            <div className="space-y-1">
              <Label className="text-xs">Full Name *</Label>
              <Input placeholder="Rajesh Kumar" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="rounded-xl h-10" required />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Phone *</Label>
              <Input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="rounded-xl h-10" required />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Service Area *</Label>
              <Input placeholder="Andheri, Mumbai" value={form.serviceArea} onChange={e => setForm({ ...form, serviceArea: e.target.value })} className="rounded-xl h-10" required />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Commission Rate (%) *</Label>
              <Input type="number" min="0" max="100" placeholder="20" value={form.commissionRate} onChange={e => setForm({ ...form, commissionRate: e.target.value })} className="rounded-xl h-10" required />
            </div>
            <Button type="submit" className="w-full h-11 rounded-xl gradient-primary text-white border-0" disabled={saving}>
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : 'Add Technician'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
