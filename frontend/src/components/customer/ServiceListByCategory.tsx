import React from 'react';
import { ArrowLeft, Star, Clock, ShoppingCart, Search } from 'lucide-react';
import { useListServicesByCategory } from '../../hooks/useQueries';
import type { ServiceCategory, Service } from '../../backend';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ServiceListByCategoryProps {
  category: ServiceCategory;
  onBack: () => void;
  onServiceSelect: (service: Service) => void;
  onAddToCart: (service: Service) => void;
}

export default function ServiceListByCategory({
  category,
  onBack,
  onServiceSelect,
  onAddToCart,
}: ServiceListByCategoryProps) {
  const { data: services, isLoading } = useListServicesByCategory(category.id);

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      {/* Header */}
      <div className="gradient-primary px-4 pt-10 pb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-white/80 mb-4 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
        <h1 className="text-xl font-bold text-white">{category.name}</h1>
        <p className="text-white/70 text-sm mt-1">
          {services?.length ?? 0} services available
        </p>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))
        ) : services && services.length > 0 ? (
          services.map((service) => (
            <ServiceCard
              key={service.id.toString()}
              service={service}
              onSelect={() => onServiceSelect(service)}
              onAddToCart={() => {
                onAddToCart(service);
                toast.success(`${service.name} added to cart!`);
              }}
            />
          ))
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-muted-foreground font-medium">No services available</p>
            <p className="text-sm text-muted-foreground mt-1">Check back soon for new services</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ServiceCard({
  service,
  onSelect,
  onAddToCart,
}: {
  service: Service;
  onSelect: () => void;
  onAddToCart: () => void;
}) {
  return (
    <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
      <div className="flex gap-3 p-3">
        <div
          className="w-20 h-20 rounded-xl bg-primary/5 flex-shrink-0 overflow-hidden cursor-pointer"
          onClick={onSelect}
        >
          {service.imageUrl ? (
            <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">🔧</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold text-sm text-foreground cursor-pointer hover:text-primary transition-colors line-clamp-1"
            onClick={onSelect}
          >
            {service.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{service.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-xs text-muted-foreground">4.8 (120)</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span className="text-xs">{Number(service.duration)} min</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-bold text-primary">₹{Number(service.price)}</span>
            <Button
              size="sm"
              onClick={onAddToCart}
              className="h-7 px-3 text-xs rounded-xl gradient-primary text-white border-0"
            >
              <ShoppingCart className="w-3 h-3 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
