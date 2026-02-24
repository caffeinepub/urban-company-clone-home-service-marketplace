import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import MobileContainer from '../components/layouts/MobileContainer';
import { Briefcase, DollarSign, User, ArrowLeft, CheckCircle, Clock, MapPin, Phone, Plus, Trash2, LogOut, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import AuthFlow from '../components/customer/AuthFlow';

type TechTab = 'jobs' | 'earnings' | 'profile';
type JobStatus = 'Assigned' | 'OnTheWay' | 'InProgress' | 'Completed';

interface MockJob {
  id: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  address: string;
  date: string;
  timeSlot: string;
  amount: number;
  status: JobStatus;
  extraItems: { name: string; price: number }[];
}

const MOCK_JOBS: MockJob[] = [
  {
    id: '1',
    bookingCode: 'BK123456',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98765 43210',
    serviceName: 'AC Deep Cleaning',
    address: '123 Main St, Andheri West, Mumbai',
    date: '2026-02-24',
    timeSlot: '10:00 AM',
    amount: 799,
    status: 'Assigned',
    extraItems: [],
  },
  {
    id: '2',
    bookingCode: 'BK789012',
    customerName: 'Rahul Mehta',
    customerPhone: '+91 87654 32109',
    serviceName: 'Plumbing Repair',
    address: '456 Park Ave, Bandra, Mumbai',
    date: '2026-02-24',
    timeSlot: '02:00 PM',
    amount: 499,
    status: 'InProgress',
    extraItems: [{ name: 'Pipe fitting', price: 150 }],
  },
];

export default function TechnicianApp() {
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  const [activeTab, setActiveTab] = useState<TechTab>('jobs');
  const [jobs, setJobs] = useState<MockJob[]>(MOCK_JOBS);
  const [activeJob, setActiveJob] = useState<MockJob | null>(null);
  const [showExtraItems, setShowExtraItems] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '' });

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  if (!isAuthenticated) {
    return (
      <MobileContainer>
        <AuthFlow onSuccess={() => {}} />
      </MobileContainer>
    );
  }

  const updateJobStatus = (jobId: string, status: JobStatus) => {
    setJobs((prev) => prev.map((j) => j.id === jobId ? { ...j, status } : j));
    if (activeJob?.id === jobId) {
      setActiveJob((prev) => prev ? { ...prev, status } : null);
    }
    toast.success(`Status updated to ${status}`);
  };

  const addExtraItem = () => {
    if (!newItem.name || !newItem.price || !activeJob) return;
    const item = { name: newItem.name, price: Number(newItem.price) };
    setJobs((prev) => prev.map((j) => j.id === activeJob.id ? { ...j, extraItems: [...j.extraItems, item] } : j));
    setActiveJob((prev) => prev ? { ...prev, extraItems: [...prev.extraItems, item] } : null);
    setNewItem({ name: '', price: '' });
    toast.success('Item added');
  };

  const removeExtraItem = (idx: number) => {
    if (!activeJob) return;
    const updated = activeJob.extraItems.filter((_, i) => i !== idx);
    setJobs((prev) => prev.map((j) => j.id === activeJob.id ? { ...j, extraItems: updated } : j));
    setActiveJob((prev) => prev ? { ...prev, extraItems: updated } : null);
  };

  if (activeJob) {
    const extraTotal = activeJob.extraItems.reduce((s, i) => s + i.price, 0);
    const grandTotal = activeJob.amount + extraTotal;

    return (
      <MobileContainer>
        <div className="flex-1 overflow-y-auto pb-6">
          <div className="gradient-primary px-4 pt-10 pb-6">
            <button onClick={() => setActiveJob(null)} className="flex items-center gap-2 text-white/80 mb-4">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Jobs</span>
            </button>
            <h1 className="text-xl font-bold text-white">Active Job</h1>
            <p className="text-white/70 text-sm">#{activeJob.bookingCode}</p>
          </div>

          <div className="px-4 pt-4 space-y-4">
            {/* Customer Info */}
            <div className="bg-card rounded-2xl p-4 border border-border shadow-xs">
              <h3 className="font-semibold text-sm text-foreground mb-3">Customer Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground">{activeJob.customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground">{activeJob.customerPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">{activeJob.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">{activeJob.date} · {activeJob.timeSlot}</span>
                </div>
              </div>
            </div>

            {/* Workflow Buttons */}
            <div className="bg-card rounded-2xl p-4 border border-border shadow-xs">
              <h3 className="font-semibold text-sm text-foreground mb-3">Service Workflow</h3>
              <div className="space-y-2">
                <Button
                  onClick={() => updateJobStatus(activeJob.id, 'OnTheWay')}
                  disabled={activeJob.status !== 'Assigned'}
                  className="w-full h-11 rounded-xl gradient-primary text-white border-0 disabled:opacity-40"
                >
                  {activeJob.status === 'Assigned' ? '📍 Mark Reached' : '✅ Reached'}
                </Button>
                <Button
                  onClick={() => updateJobStatus(activeJob.id, 'InProgress')}
                  disabled={activeJob.status !== 'OnTheWay'}
                  className="w-full h-11 rounded-xl gradient-primary text-white border-0 disabled:opacity-40"
                >
                  {activeJob.status === 'InProgress' || activeJob.status === 'Completed' ? '✅ Work Started' : '🔧 Mark Work Started'}
                </Button>
                <Button
                  onClick={() => setShowExtraItems(!showExtraItems)}
                  disabled={activeJob.status !== 'InProgress'}
                  variant="outline"
                  className="w-full h-11 rounded-xl disabled:opacity-40"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Extra Items ({activeJob.extraItems.length})
                </Button>
                <Button
                  onClick={() => updateJobStatus(activeJob.id, 'Completed')}
                  disabled={activeJob.status !== 'InProgress'}
                  className="w-full h-11 rounded-xl bg-green-600 hover:bg-green-700 text-white border-0 disabled:opacity-40"
                >
                  ✅ Mark Completed
                </Button>
              </div>
            </div>

            {/* Extra Items */}
            {showExtraItems && (
              <div className="bg-card rounded-2xl p-4 border border-border shadow-xs">
                <h3 className="font-semibold text-sm text-foreground mb-3">Extra Items</h3>
                {activeJob.extraItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-foreground">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-primary">₹{item.price}</span>
                      <button onClick={() => removeExtraItem(idx)} className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex gap-2 mt-3">
                  <Input placeholder="Item name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} className="rounded-xl h-9 text-sm" />
                  <Input placeholder="₹" type="number" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} className="rounded-xl h-9 text-sm w-20" />
                  <Button onClick={addExtraItem} size="sm" className="rounded-xl gradient-primary text-white border-0 h-9">Add</Button>
                </div>
              </div>
            )}

            {/* Final Bill */}
            <div className="bg-card rounded-2xl p-4 border border-border shadow-xs">
              <h3 className="font-semibold text-sm text-foreground mb-3">Final Bill</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base price</span>
                  <span>₹{activeJob.amount}</span>
                </div>
                {activeJob.extraItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span>₹{item.price}</span>
                  </div>
                ))}
                <div className="border-t border-border pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{grandTotal}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Commission (20%)</span>
                  <span className="text-destructive">-₹{Math.round(grandTotal * 0.2)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-green-600">
                  <span>Your Earnings</span>
                  <span>₹{Math.round(grandTotal * 0.8)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MobileContainer>
    );
  }

  return (
    <MobileContainer>
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Header */}
        <div className="gradient-primary px-4 pt-10 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Welcome back</p>
              <h1 className="text-xl font-bold text-white">Technician Dashboard</h1>
            </div>
            <button onClick={handleLogout} className="p-2 bg-white/20 rounded-xl">
              <LogOut className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 pt-4">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TechTab)}>
            <TabsList className="w-full rounded-xl mb-4">
              <TabsTrigger value="jobs" className="flex-1 rounded-lg text-xs">
                <Briefcase className="w-3.5 h-3.5 mr-1" />
                Jobs
              </TabsTrigger>
              <TabsTrigger value="earnings" className="flex-1 rounded-lg text-xs">
                <DollarSign className="w-3.5 h-3.5 mr-1" />
                Earnings
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex-1 rounded-lg text-xs">
                <User className="w-3.5 h-3.5 mr-1" />
                Profile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="jobs">
              <div className="space-y-3">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-card rounded-2xl p-4 border border-border shadow-xs">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm text-foreground">{job.serviceName}</p>
                        <p className="text-xs text-muted-foreground">#{job.bookingCode}</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        job.status === 'Completed' ? 'bg-green-50 text-green-600' :
                        job.status === 'InProgress' ? 'bg-orange-50 text-orange-600' :
                        job.status === 'OnTheWay' ? 'bg-purple-50 text-purple-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="w-3 h-3" />
                        <span>{job.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span className="line-clamp-1">{job.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{job.date} · {job.timeSlot}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {job.status === 'Assigned' && (
                        <>
                          <Button
                            onClick={() => setActiveJob(job)}
                            size="sm"
                            className="flex-1 h-8 rounded-xl gradient-primary text-white border-0 text-xs"
                          >
                            Accept & Start
                          </Button>
                          <Button
                            onClick={() => {
                              setJobs((prev) => prev.filter((j) => j.id !== job.id));
                              toast.success('Job rejected');
                            }}
                            size="sm"
                            variant="outline"
                            className="flex-1 h-8 rounded-xl text-xs border-destructive/30 text-destructive"
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {job.status !== 'Assigned' && job.status !== 'Completed' && (
                        <Button
                          onClick={() => setActiveJob(job)}
                          size="sm"
                          className="flex-1 h-8 rounded-xl gradient-primary text-white border-0 text-xs"
                        >
                          Continue Job
                        </Button>
                      )}
                      {job.status === 'Completed' && (
                        <div className="flex items-center gap-2 text-green-600 text-xs font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Completed · ₹{Math.round(job.amount * 0.8)} earned
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="earnings">
              <EarningsTab jobs={jobs} />
            </TabsContent>

            <TabsContent value="profile">
              <div className="bg-card rounded-2xl p-4 border border-border shadow-xs text-center">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8 text-white" />
                </div>
                <p className="font-bold text-foreground">Technician</p>
                <p className="text-xs text-muted-foreground mt-1">Service Professional</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-primary">{jobs.filter(j => j.status === 'Completed').length}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-accent">4.8 ⭐</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>
                <Button onClick={handleLogout} variant="outline" className="w-full mt-4 rounded-xl border-destructive/30 text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MobileContainer>
  );
}

function EarningsTab({ jobs }: { jobs: MockJob[] }) {
  const completedJobs = jobs.filter((j) => j.status === 'Completed');
  const totalEarnings = completedJobs.reduce((s, j) => s + Math.round(j.amount * 0.8), 0);
  const totalCommission = completedJobs.reduce((s, j) => s + Math.round(j.amount * 0.2), 0);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="daily">
        <TabsList className="w-full rounded-xl">
          <TabsTrigger value="daily" className="flex-1 rounded-lg text-xs">Daily</TabsTrigger>
          <TabsTrigger value="weekly" className="flex-1 rounded-lg text-xs">Weekly</TabsTrigger>
          <TabsTrigger value="total" className="flex-1 rounded-lg text-xs">Total</TabsTrigger>
        </TabsList>

        {(['daily', 'weekly', 'total'] as const).map((period) => (
          <TabsContent key={period} value={period}>
            <div className="gradient-primary rounded-2xl p-5 text-white mb-4">
              <p className="text-white/70 text-xs uppercase tracking-wide mb-1">
                {period === 'daily' ? "Today's" : period === 'weekly' ? "This Week's" : 'Total'} Earnings
              </p>
              <p className="text-3xl font-bold">
                ₹{period === 'daily' ? Math.round(totalEarnings * 0.3) : period === 'weekly' ? Math.round(totalEarnings * 0.7) : totalEarnings}
              </p>
              <p className="text-white/60 text-xs mt-1">
                Commission deducted: ₹{period === 'daily' ? Math.round(totalCommission * 0.3) : period === 'weekly' ? Math.round(totalCommission * 0.7) : totalCommission}
              </p>
            </div>

            <div className="bg-card rounded-2xl p-4 border border-border shadow-xs">
              <h3 className="font-semibold text-sm text-foreground mb-3">Completed Jobs</h3>
              {completedJobs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No completed jobs yet</p>
              ) : (
                <div className="space-y-3">
                  {completedJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm font-medium text-foreground">{job.serviceName}</p>
                        <p className="text-xs text-muted-foreground">#{job.bookingCode}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-600">+₹{Math.round(job.amount * 0.8)}</p>
                        <p className="text-xs text-muted-foreground">-₹{Math.round(job.amount * 0.2)} comm.</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
