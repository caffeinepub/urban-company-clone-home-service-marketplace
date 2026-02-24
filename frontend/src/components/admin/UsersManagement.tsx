import React, { useState } from 'react';
import { useListApprovals, useSetApproval } from '../../hooks/useQueries';
import { ApprovalStatus } from '../../backend';
import { Search, Shield, ShieldOff, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const PAGE_SIZE = 20;

export default function UsersManagement() {
  const { data: approvals, isLoading } = useListApprovals();
  const setApproval = useSetApproval();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const filtered = (approvals ?? []).filter((a) =>
    search ? a.principal.toString().toLowerCase().includes(search.toLowerCase()) : true
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleBlock = async (principal: import('@dfinity/principal').Principal, currentStatus: ApprovalStatus) => {
    const newStatus = currentStatus === ApprovalStatus.rejected ? ApprovalStatus.approved : ApprovalStatus.rejected;
    try {
      await setApproval.mutateAsync({ user: principal, status: newStatus });
      toast.success(newStatus === ApprovalStatus.rejected ? 'User blocked' : 'User unblocked');
    } catch {
      toast.error('Failed to update user status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground text-sm mt-1">{filtered.length} total users</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by principal ID..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          className="pl-10 rounded-xl"
        />
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Principal</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-48 rounded" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-5 w-20 rounded-full" /></td>
                    <td className="px-4 py-3 text-right"><Skeleton className="h-8 w-20 rounded-xl ml-auto" /></td>
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground text-sm">
                    No users found
                  </td>
                </tr>
              ) : (
                paginated.map((approval) => (
                  <tr key={approval.principal.toString()} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-mono text-foreground truncate max-w-[200px]">
                        {approval.principal.toString().slice(0, 20)}...
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        approval.status === ApprovalStatus.approved ? 'bg-green-50 text-green-600' :
                        approval.status === ApprovalStatus.rejected ? 'bg-red-50 text-red-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {approval.status === ApprovalStatus.approved ? 'Active' :
                         approval.status === ApprovalStatus.rejected ? 'Blocked' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedUser(approval.principal.toString())}
                          className="h-8 w-8 p-0 rounded-xl"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant={approval.status === ApprovalStatus.rejected ? 'outline' : 'ghost'}
                              className={`h-8 px-3 rounded-xl text-xs ${
                                approval.status === ApprovalStatus.rejected
                                  ? 'border-green-300 text-green-600 hover:bg-green-50'
                                  : 'text-destructive hover:bg-destructive/10'
                              }`}
                            >
                              {approval.status === ApprovalStatus.rejected ? (
                                <><Shield className="w-3 h-3 mr-1" />Unblock</>
                              ) : (
                                <><ShieldOff className="w-3 h-3 mr-1" />Block</>
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {approval.status === ApprovalStatus.rejected ? 'Unblock User?' : 'Block User?'}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {approval.status === ApprovalStatus.rejected
                                  ? 'This will restore the user\'s access to the platform.'
                                  : 'This will prevent the user from creating new bookings.'}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleBlock(approval.principal, approval.status)}
                                className={`rounded-xl ${approval.status !== ApprovalStatus.rejected ? 'bg-destructive hover:bg-destructive/90' : ''}`}
                              >
                                Confirm
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setPage(p => p - 1)} disabled={page === 0} className="h-8 w-8 p-0 rounded-xl">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1} className="h-8 w-8 p-0 rounded-xl">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Panel */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedUser(null)}>
          <div className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-card-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-foreground mb-4">User Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Principal ID</p>
                <p className="text-sm font-mono text-foreground break-all">{selectedUser}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-sm text-foreground">
                  {approvals?.find(a => a.principal.toString() === selectedUser)?.status ?? 'Unknown'}
                </p>
              </div>
            </div>
            <Button onClick={() => setSelectedUser(null)} className="w-full mt-4 rounded-xl" variant="outline">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
