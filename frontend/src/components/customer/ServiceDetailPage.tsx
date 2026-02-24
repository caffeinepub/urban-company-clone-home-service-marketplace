import React from 'react';
import { ArrowLeft, Star, Clock, ShoppingCart, CheckCircle, Users } from 'lucide-react';
import { useGetServiceDetails } from '../../hooks/useQueries';
import type { Service } from '../../backend';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface ServiceDetailPageProps {
  serviceId: bigint;
  onBack: () => void;
  onAddToCart: (service: Service) => void;
}

export default function ServiceDetailPage({ serviceId, onBack, onAddToCart }: ServiceDetailPageProps) {
  const { data: service, isLoading } = useGetServiceDetails(serviceId);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto pb-20">
        <Skeleton className="h-56 w-full" />
        <div className="px-4 pt-4 space-y-3">
          <Skeleton className="h-8 w-3/4 rounded-xl" />
          <Skeleton className="h-4 w-1/2 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Service not found</p>
          <Button onClick={onBack} variant="ghost" className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      {/* Image */}
      <div className="relative h-56 bg-primary/5">
        {service.imageUrl ? (
          <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">🔧</div>
        )}
        <button
          onClick={onBack}
          className="absolute top-10 left-4 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        {!service.active && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold bg-black/60 px-4 py-2 rounded-xl">Currently Unavailable</span>
          </div>
        )}
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Title & Price */}
        <div>
          <h1 className="text-xl font-bold text-foreground">{service.name}</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium">4.8</span>
              <span className="text-xs text-muted-foreground">(248 reviews)</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span className="text-xs">1.2k+ booked</span>
            </div>
          </div>
        </div>

        {/* Price & Duration */}
        <div className="flex gap-3">
          <div className="flex-1 bg-primary/5 rounded-2xl p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Price</p>
            <p className="text-xl font-bold text-primary">₹{Number(service.price)}</p>
          </div>
          <div className="flex-1 bg-accent/5 rounded-2xl p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Duration</p>
            <div className="flex items-center justify-center gap-1">
              <Clock className="w-4 h-4 text-accent" />
              <p className="text-xl font-bold text-accent">{Number(service.duration)}</p>
              <p className="text-xs text-muted-foreground">min</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-card rounded-2xl p-4 border border-border shadow-xs">
          <h3 className="font-semibold text-sm text-foreground mb-2">About this service</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
        </div>

        {/* What's included */}
        <div className="bg-card rounded-2xl p-4 border border-border shadow-xs">
          <h3 className="font-semibold text-sm text-foreground mb-3">What's included</h3>
          <div className="space-y-2">
            {[
              'Professional & verified technician',
              'All tools and equipment provided',
              'Service warranty included',
              'Post-service cleanup',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews placeholder */}
        <div className="bg-card rounded-2xl p-4 border border-border shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm text-foreground">Customer Reviews</h3>
            <span className="text-xs text-primary">See all</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="text-4xl font-bold text-foreground">4.8</div>
            <div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${s <= 4 ? 'text-yellow-500 fill-yellow-500' : 'text-yellow-500 fill-yellow-500/30'}`} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">248 reviews</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Rahul S.', rating: 5, text: 'Excellent service! Very professional and on time.' },
              { name: 'Priya M.', rating: 5, text: 'Great work, highly recommend!' },
            ].map((review) => (
              <div key={review.name} className="border-t border-border pt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">{review.name}</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile px-4 pb-6 pt-3 bg-background/95 backdrop-blur-sm border-t border-border">
        <Button
          onClick={() => {
            onAddToCart(service);
            toast.success(`${service.name} added to cart!`);
          }}
          disabled={!service.active}
          className="w-full h-12 rounded-xl gradient-primary text-white font-semibold border-0 text-sm"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart — ₹{Number(service.price)}
        </Button>
      </div>
    </div>
  );
}
