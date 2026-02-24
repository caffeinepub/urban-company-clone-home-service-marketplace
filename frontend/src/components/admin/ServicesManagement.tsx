import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useListCategories,
  useCreateCategory,
  useListServicesByCategory,
  useCreateService,
  useUpdateService,
  useDeleteService,
} from '../../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Loader2, ChevronRight } from 'lucide-react';
import type { ServiceCategory, Service } from '../../backend';

// ── Add/Edit Service Modal ────────────────────────────────────────────────────

interface ServiceFormState {
  categoryId: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  imageUrl: string;
  active: boolean;
}

function AddEditServiceModal({
  open,
  onClose,
  editService,
  categories,
  defaultCategoryId,
}: {
  open: boolean;
  onClose: () => void;
  editService: Service | null;
  categories: ServiceCategory[];
  defaultCategoryId: bigint | null;
}) {
  const createService = useCreateService();
  const updateService = useUpdateService();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ServiceFormState>({
    categoryId: editService ? editService.categoryId.toString() : (defaultCategoryId?.toString() ?? ''),
    name: editService?.name ?? '',
    description: editService?.description ?? '',
    price: editService ? Number(editService.price).toString() : '',
    duration: editService ? Number(editService.duration).toString() : '',
    imageUrl: editService?.imageUrl ?? '',
    active: editService?.active ?? true,
  });

  React.useEffect(() => {
    setForm({
      categoryId: editService ? editService.categoryId.toString() : (defaultCategoryId?.toString() ?? ''),
      name: editService?.name ?? '',
      description: editService?.description ?? '',
      price: editService ? Number(editService.price).toString() : '',
      duration: editService ? Number(editService.duration).toString() : '',
      imageUrl: editService?.imageUrl ?? '',
      active: editService?.active ?? true,
    });
  }, [editService, defaultCategoryId, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(form.price);
    const duration = Number(form.duration);
    if (!form.name.trim()) { toast.error('Service name is required'); return; }
    if (!form.categoryId) { toast.error('Please select a category'); return; }
    if (isNaN(price) || price <= 0) { toast.error('Price must be a positive number'); return; }
    if (isNaN(duration) || duration <= 0 || !Number.isInteger(duration)) {
      toast.error('Duration must be a positive whole number (minutes)');
      return;
    }

    setSaving(true);
    try {
      if (editService) {
        await updateService.mutateAsync({
          serviceId: editService.id,
          name: form.name.trim(),
          description: form.description.trim(),
          price: BigInt(price),
          duration: BigInt(duration),
          imageUrl: form.imageUrl.trim(),
          active: form.active,
        });
        toast.success('Service updated!');
      } else {
        await createService.mutateAsync({
          categoryId: BigInt(form.categoryId),
          name: form.name.trim(),
          description: form.description.trim(),
          price: BigInt(price),
          duration: BigInt(duration),
          imageUrl: form.imageUrl.trim(),
        });
        toast.success('Service created!');
      }
      onClose();
    } catch {
      toast.error('Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div className="space-y-1">
            <Label className="text-xs">Category *</Label>
            <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
              <SelectTrigger className="rounded-xl h-10">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {categories.map((c) => (
                  <SelectItem key={c.id.toString()} value={c.id.toString()}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Service Name *</Label>
            <Input
              placeholder="e.g. AC Deep Cleaning"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-xl h-10"
              required
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Description</Label>
            <Textarea
              placeholder="Describe what's included..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="rounded-xl resize-none min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Price (₹) *</Label>
              <Input
                type="number"
                min="1"
                step="1"
                placeholder="499"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="rounded-xl h-10"
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Duration (min) *</Label>
              <Input
                type="number"
                min="1"
                step="1"
                placeholder="60"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="rounded-xl h-10"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Image URL</Label>
            <Input
              placeholder="https://..."
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="rounded-xl h-10"
            />
          </div>

          {editService && (
            <div className="flex items-center gap-3 py-1">
              <Switch
                id="active-toggle"
                checked={form.active}
                onCheckedChange={(checked) => setForm({ ...form, active: checked })}
              />
              <Label htmlFor="active-toggle" className="text-sm cursor-pointer">
                {form.active ? 'Active (visible to customers)' : 'Inactive (hidden from customers)'}
              </Label>
            </div>
          )}

          <DialogFooter className="gap-2 mt-2">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl flex-1 gradient-primary text-white border-0"
              disabled={saving}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editService ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Services List for a Category ──────────────────────────────────────────────

function ServicesList({
  categoryId,
  categoryName,
  categories,
}: {
  categoryId: bigint;
  categoryName: string;
  categories: ServiceCategory[];
}) {
  const { data: services, isLoading } = useListServicesByCategory(categoryId);
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const handleToggleActive = async (service: Service) => {
    try {
      await updateService.mutateAsync({ serviceId: service.id, active: !service.active });
      toast.success(service.active ? 'Service deactivated' : 'Service activated');
    } catch {
      toast.error('Failed to update service');
    }
  };

  const handleDelete = async (serviceId: bigint) => {
    try {
      await deleteService.mutateAsync(serviceId);
      toast.success('Service deleted');
    } catch {
      toast.error('Failed to delete service');
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div>
          <h3 className="font-semibold text-sm text-foreground">{categoryName}</h3>
          <p className="text-xs text-muted-foreground">{services?.length ?? 0} services</p>
        </div>
        <Button
          size="sm"
          onClick={() => setShowAddModal(true)}
          className="h-7 px-3 text-xs rounded-xl gradient-primary text-white border-0"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Service
        </Button>
      </div>

      {isLoading ? (
        <div className="p-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : !services || services.length === 0 ? (
        <div className="px-4 py-10 text-center">
          <Package className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No services in this category yet.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-xs text-primary mt-1 hover:underline"
          >
            Add the first service
          </button>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {services.map((service) => (
            <div key={service.id.toString()} className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 bg-primary/5 rounded-xl flex-shrink-0 overflow-hidden">
                {service.imageUrl ? (
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg">🔧</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{service.name}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs font-bold text-primary">₹{Number(service.price)}</span>
                  <span className="text-xs text-muted-foreground">{Number(service.duration)} min</span>
                  <span className={`text-xs font-medium ${service.active ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {service.active ? '● Active' : '○ Inactive'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Switch
                  checked={service.active}
                  onCheckedChange={() => handleToggleActive(service)}
                  className="scale-75"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingService(service)}
                  className="h-7 w-7 p-0 rounded-lg"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 rounded-lg text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Service?</AlertDialogTitle>
                      <AlertDialogDescription>
                        "{service.name}" will be permanently removed. This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(service.id)}
                        className="rounded-xl bg-destructive hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddEditServiceModal
        open={showAddModal || editingService !== null}
        onClose={() => { setShowAddModal(false); setEditingService(null); }}
        editService={editingService}
        categories={categories}
        defaultCategoryId={categoryId}
      />
    </div>
  );
}

// ── Category Management Section ───────────────────────────────────────────────

function CategoryManagementSection({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: {
  categories: ServiceCategory[];
  selectedCategoryId: bigint | null;
  onSelectCategory: (id: bigint) => void;
}) {
  const createCategory = useCreateCategory();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', iconUrl: '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Category name is required'); return; }
    setSaving(true);
    try {
      await createCategory.mutateAsync({ name: form.name.trim(), iconUrl: form.iconUrl.trim() });
      toast.success('Category created!');
      setForm({ name: '', iconUrl: '' });
      setShowModal(false);
    } catch {
      toast.error('Failed to create category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="font-semibold text-sm text-foreground">Categories</h3>
        <Button
          size="sm"
          onClick={() => setShowModal(true)}
          className="h-7 px-3 text-xs rounded-xl gradient-primary text-white border-0"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add
        </Button>
      </div>

      <div className="divide-y divide-border">
        {categories.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
            No categories yet. Add one to get started.
          </div>
        ) : (
          categories.map((cat) => (
            <button
              key={cat.id.toString()}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors text-left ${
                selectedCategoryId === cat.id ? 'bg-primary/5' : ''
              }`}
            >
              <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                {cat.iconUrl ? (
                  <img
                    src={cat.iconUrl}
                    alt={cat.name}
                    className="w-6 h-6 object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <Package className="w-4 h-4 text-primary" />
                )}
              </div>
              <span
                className={`flex-1 text-sm font-medium ${
                  selectedCategoryId === cat.id ? 'text-primary' : 'text-foreground'
                }`}
              >
                {cat.name}
              </span>
              <ChevronRight
                className={`w-4 h-4 ${
                  selectedCategoryId === cat.id ? 'text-primary' : 'text-muted-foreground'
                }`}
              />
            </button>
          ))
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-3 mt-2">
            <div className="space-y-1">
              <Label className="text-xs">Category Name *</Label>
              <Input
                placeholder="e.g. Plumbing"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-xl h-10"
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Icon URL</Label>
              <Input
                placeholder="https://... or /assets/..."
                value={form.iconUrl}
                onChange={(e) => setForm({ ...form, iconUrl: e.target.value })}
                className="rounded-xl h-10"
              />
            </div>
            <DialogFooter className="gap-2 mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowModal(false)}
                className="rounded-xl flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl flex-1 gradient-primary text-white border-0"
                disabled={saving}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Main ServicesManagement ───────────────────────────────────────────────────

export default function ServicesManagement() {
  const { data: categories, isLoading } = useListCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<bigint | null>(null);

  const selectedCategory = categories?.find((c) => c.id === selectedCategoryId);

  React.useEffect(() => {
    if (categories && categories.length > 0 && selectedCategoryId === null) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Services & Categories</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage service categories and their offerings
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <div className="lg:col-span-2">
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CategoryManagementSection
            categories={categories ?? []}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />
          <div className="lg:col-span-2">
            {selectedCategory ? (
              <ServicesList
                categoryId={selectedCategory.id}
                categoryName={selectedCategory.name}
                categories={categories ?? []}
              />
            ) : (
              <div className="bg-card rounded-2xl border border-border shadow-card p-10 text-center">
                <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">Select a category</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose a category from the left to manage its services
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
