import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile, Address, UserProfileResponse, ServiceCategory, Service, ApprovalStatus } from '../backend';
import { UserRole } from '../backend';
import type { Principal } from '@dfinity/principal';

// ── User Profile ─────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const query = useQuery<UserProfileResponse | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return useQuery<UserRole>({
    queryKey: ['callerUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerAdmin();
    },
    // Only run when authenticated — anonymous actor always returns false
    enabled: !!actor && !actorFetching && isAuthenticated,
  });
}

// ── Addresses ────────────────────────────────────────────────────────────────

export function useListAddresses() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return useQuery<Address[]>({
    queryKey: ['addresses'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listAddresses();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });
}

export function useSaveAddress() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (address: Address) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveAddress(address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useSetDefaultAddress() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addressId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setDefaultAddress(addressId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
}

export function useDeleteAddress() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addressId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteAddress(addressId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
}

// ── Categories ───────────────────────────────────────────────────────────────

export function useListCategories() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ServiceCategory[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCategories();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetTopActiveCategories(limit: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ServiceCategory[]>({
    queryKey: ['topCategories', limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTopActiveCategories(BigInt(limit));
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetCategoryWithServices() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<[ServiceCategory, Service[]][]>({
    queryKey: ['categoryWithServices'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCategoryWithServices();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, iconUrl }: { name: string; iconUrl: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCategory(name, iconUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['topCategories'] });
      queryClient.invalidateQueries({ queryKey: ['categoryWithServices'] });
    },
  });
}

export function useUpdateCategoryOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ categoryId, newOrder }: { categoryId: bigint; newOrder: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCategoryOrder(categoryId, newOrder);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

// ── Services ─────────────────────────────────────────────────────────────────

export function useListServicesByCategory(categoryId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Service[]>({
    queryKey: ['servicesByCategory', categoryId?.toString()],
    queryFn: async () => {
      if (!actor || categoryId === null) return [];
      return actor.getActiveServicesByCategory(categoryId);
    },
    enabled: !!actor && !actorFetching && categoryId !== null,
  });
}

export function useGetServiceDetails(serviceId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Service | null>({
    queryKey: ['serviceDetails', serviceId?.toString()],
    queryFn: async () => {
      if (!actor || serviceId === null) return null;
      return actor.getServiceDetails(serviceId);
    },
    enabled: !!actor && !actorFetching && serviceId !== null,
  });
}

export function useCreateService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      categoryId: bigint;
      name: string;
      description: string;
      price: bigint;
      duration: bigint;
      imageUrl: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createService(
        params.categoryId,
        params.name,
        params.description,
        params.price,
        params.duration,
        params.imageUrl
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicesByCategory'] });
      queryClient.invalidateQueries({ queryKey: ['categoryWithServices'] });
    },
  });
}

export function useUpdateService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      serviceId: bigint;
      name?: string;
      description?: string;
      price?: bigint;
      duration?: bigint;
      imageUrl?: string;
      active?: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateService(
        params.serviceId,
        params.name ?? null,
        params.description ?? null,
        params.price ?? null,
        params.duration ?? null,
        params.imageUrl ?? null,
        params.active ?? null
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicesByCategory'] });
      queryClient.invalidateQueries({ queryKey: ['serviceDetails'] });
      queryClient.invalidateQueries({ queryKey: ['categoryWithServices'] });
    },
  });
}

export function useDeleteService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteService(serviceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicesByCategory'] });
      queryClient.invalidateQueries({ queryKey: ['categoryWithServices'] });
    },
  });
}

// ── Approvals ────────────────────────────────────────────────────────────────

export function useListApprovals() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return useQuery({
    queryKey: ['approvals'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listApprovals();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });
}

export function useSetApproval() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, status }: { user: Principal; status: ApprovalStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setApproval(user, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    },
  });
}

export function useAssignCallerUserRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, role }: { user: Principal; role: UserRole }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignCallerUserRole(user, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerUserRole'] });
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
    },
  });
}
