import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, ChevronRight, Star, Clock, ChevronLeft } from 'lucide-react';
import { useGetTopActiveCategories, useGetCategoryWithServices } from '../../hooks/useQueries';
import NotificationBell from '../shared/NotificationBell';
import type { Service, ServiceCategory } from '../../backend';
import { Skeleton } from '@/components/ui/skeleton';

const CATEGORY_ICONS: Record<string, string> = {
  plumbing: '/assets/generated/cat-plumbing.dim_80x80.png',
  electrical: '/assets/generated/cat-electrical.dim_80x80.png',
  cleaning: '/assets/generated/cat-cleaning.dim_80x80.png',
  ac: '/assets/generated/cat-ac.dim_80x80.png',
  painting: '/assets/generated/cat-painting.dim_80x80.png',
  carpentry: '/assets/generated/cat-carpentry.dim_80x80.png',
  appliance: '/assets/generated/cat-appliance.dim_80x80.png',
  pest: '/assets/generated/cat-pest.dim_80x80.png',
};

const BANNERS = [
  '/assets/generated/promo-banner-1.dim_1200x400.png',
  '/assets/generated/promo-banner-2.dim_1200x400.png',
  '/assets/generated/banner-hero.dim_1200x400.png',
];

interface HomeScreenProps {
  onCategorySelect: (category: ServiceCategory) => void;
  onServiceSelect: (service: Service) => void;
  isAuthenticated: boolean;
  userName?: string;
  defaultAddress?: string;
}

function BannerSlider() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNERS.length);
    }, 3500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  return (
    <div className="relative mx-4 rounded-2xl overflow-hidden shadow-card" style={{ height: 160 }}>
      {BANNERS.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`Promo banner ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
            }`}
          />
        ))}
      </div>
      <button
        onClick={() => setCurrent((prev) => (prev - 1 + BANNERS.length) % BANNERS.length)}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/30 rounded-full flex items-center justify-center text-white"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % BANNERS.length)}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/30 rounded-full flex items-center justify-center text-white"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function getCategoryIcon(category: ServiceCategory): string {
  const nameLower = category.name.toLowerCase();
  for (const [key, url] of Object.entries(CATEGORY_ICONS)) {
    if (nameLower.includes(key)) return url;
  }
  return category.iconUrl || '/assets/generated/cat-cleaning.dim_80x80.png';
}

export default function HomeScreen({
  onCategorySelect,
  onServiceSelect,
  isAuthenticated,
  userName,
  defaultAddress,
}: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: categories, isLoading: categoriesLoading } = useGetTopActiveCategories(8);
  const { data: categoryWithServices, isLoading: featuredLoading } = useGetCategoryWithServices();

  const featuredServices = categoryWithServices
    ?.flatMap(([, services]) => services)
    .slice(0, 8) ?? [];

  const filteredCategories = categories?.filter((c) =>
    searchQuery ? c.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      {/* Header */}
      <div className="gradient-primary px-4 pt-10 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <MapPin className="w-4 h-4 text-white/80 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-white/70 text-[10px] uppercase tracking-wide font-medium">Your Location</p>
              <p className="text-white text-sm font-semibold truncate">
                {defaultAddress || 'Set your location'}
              </p>
            </div>
          </div>
          <NotificationBell isAuthenticated={isAuthenticated} />
        </div>

        <div className="mb-1">
          <p className="text-white/80 text-sm">
            Hello, {userName ? userName.split(' ')[0] : 'there'} 👋
          </p>
          <h1 className="text-white text-xl font-bold">What service do you need?</h1>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 -mt-5 mb-5">
        <div className="bg-card rounded-2xl shadow-card flex items-center gap-3 px-4 py-3">
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder="Search for services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
      </div>

      {/* Banner Slider */}
      <div className="mb-6">
        <BannerSlider />
      </div>

      {/* Categories */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-foreground">Our Services</h2>
          <button className="text-xs text-primary font-medium flex items-center gap-1">
            See all <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {categoriesLoading ? (
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Skeleton className="w-14 h-14 rounded-2xl" />
                <Skeleton className="h-3 w-12 rounded" />
              </div>
            ))}
          </div>
        ) : filteredCategories && filteredCategories.length > 0 ? (
          <div className="grid grid-cols-4 gap-3">
            {filteredCategories.map((category) => (
              <button
                key={category.id.toString()}
                onClick={() => onCategorySelect(category)}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors overflow-hidden shadow-xs">
                  <img
                    src={getCategoryIcon(category)}
                    alt={category.name}
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/generated/cat-cleaning.dim_80x80.png';
                    }}
                  />
                </div>
                <span className="text-[10px] font-medium text-foreground text-center leading-tight line-clamp-2">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {[
              { name: 'Plumbing', icon: 'cat-plumbing' },
              { name: 'Electrical', icon: 'cat-electrical' },
              { name: 'Cleaning', icon: 'cat-cleaning' },
              { name: 'AC Repair', icon: 'cat-ac' },
              { name: 'Painting', icon: 'cat-painting' },
              { name: 'Carpentry', icon: 'cat-carpentry' },
              { name: 'Appliance', icon: 'cat-appliance' },
              { name: 'Pest Control', icon: 'cat-pest' },
            ].map((cat) => (
              <div key={cat.name} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center overflow-hidden shadow-xs">
                  <img
                    src={`/assets/generated/${cat.icon}.dim_80x80.png`}
                    alt={cat.name}
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <span className="text-[10px] font-medium text-foreground text-center leading-tight">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Featured Services */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-foreground">Featured Services</h2>
          <button className="text-xs text-primary font-medium flex items-center gap-1">
            See all <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {featuredLoading ? (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="w-40 h-48 rounded-2xl flex-shrink-0" />
            ))}
          </div>
        ) : featuredServices.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {featuredServices.map((service) => (
              <FeaturedServiceCard
                key={service.id.toString()}
                service={service}
                onClick={() => onServiceSelect(service)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-muted/50 rounded-2xl p-6 text-center">
            <p className="text-sm text-muted-foreground">No services available yet</p>
            <p className="text-xs text-muted-foreground mt-1">Check back soon!</p>
          </div>
        )}
      </div>

      {/* Why Choose Us */}
      <div className="px-4 mb-6">
        <h2 className="text-base font-bold text-foreground mb-3">Why Choose ServeEase?</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { emoji: '✅', title: 'Verified Pros', desc: 'Background-checked technicians' },
            { emoji: '⚡', title: 'Fast Booking', desc: 'Book in under 2 minutes' },
            { emoji: '💰', title: 'Best Prices', desc: 'Transparent pricing' },
            { emoji: '🛡️', title: 'Guaranteed', desc: '100% satisfaction guarantee' },
          ].map((item) => (
            <div key={item.title} className="bg-card rounded-2xl p-3 shadow-xs border border-border">
              <div className="text-2xl mb-1">{item.emoji}</div>
              <p className="text-xs font-semibold text-foreground">{item.title}</p>
              <p className="text-[10px] text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeaturedServiceCard({ service, onClick }: { service: Service; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 w-40 bg-card rounded-2xl shadow-card border border-border overflow-hidden text-left hover:shadow-card-lg transition-shadow"
    >
      <div className="h-24 bg-primary/5 overflow-hidden">
        {service.imageUrl ? (
          <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-3xl">🔧</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs font-semibold text-foreground line-clamp-2 mb-1">{service.name}</p>
        <div className="flex items-center gap-1 mb-1">
          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
          <span className="text-[10px] text-muted-foreground">4.8</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-primary">₹{Number(service.price)}</span>
          <div className="flex items-center gap-0.5 text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span className="text-[10px]">{Number(service.duration)}m</span>
          </div>
        </div>
      </div>
    </button>
  );
}
