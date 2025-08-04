import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiService from '@/services/api'
import { transformApiFriendToAppUser, transformApiUserToAppUser } from '@/utils/apiTransformers'

// Authentication hooks
export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name, pin }: { name: string; pin: string }) => apiService.login(name, pin),
    onSuccess: data => {
      if (data.success && data.user) {
        const appUser = transformApiUserToAppUser(data.user)
        queryClient.setQueryData(['user', appUser.id], appUser)
        queryClient.invalidateQueries({ queryKey: ['user'] })
      }
    },
    onError: error => {
      console.error(error)
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => apiService.logout(userId),
    onSuccess: () => {
      queryClient.clear()
    },
  })
}

// User hooks
export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name, pin }: { name: string; pin: string }) => apiService.createUser(name, pin),
    onSuccess: data => {
      if (data.success && data.user) {
        const appUser = transformApiUserToAppUser(data.user)
        queryClient.setQueryData(['user', appUser.id], appUser)
        queryClient.invalidateQueries({ queryKey: ['user'] })
      }
    },
  })
}

export const useUserQuery = (userId?: string, slug?: string, details = false, disabled = false) => {
  return useQuery({
    queryKey: ['user', userId, slug, details],
    queryFn: async () => {
      const response = await apiService.getUser(userId, slug, details)
      if (response.success && response.user) {
        const transformedUser = transformApiUserToAppUser(response.user)
        return transformedUser
      }
      return null
    },
    enabled: !!(userId || slug) && !disabled,
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, pin }: { userId: string; pin: string }) => apiService.deleteUser(userId, pin),
    onSuccess: () => {
      queryClient.clear()
    },
  })
}

// Friend hooks
export const useFriendsQuery = (userId: string) => {
  return useQuery({
    queryKey: ['friends', userId],
    queryFn: async () => {
      const response = await apiService.getFriends(userId)
      if (response.success && response.friends) {
        return response.friends.map(transformApiFriendToAppUser)
      }
      return []
    },
    enabled: !!userId,
  })
}

export const useIncomingFriendRequestsQuery = (userId: string) => {
  return useQuery({
    queryKey: ['friend-requests', 'incoming', userId],
    queryFn: async () => {
      const response = await apiService.getIncomingFriendRequests(userId)
      if (response.success && response.incoming_requests) {
        return response.incoming_requests.map(transformApiFriendToAppUser)
      }
      return []
    },
    enabled: !!userId,
  })
}

export const useOutgoingFriendRequestsQuery = (userId: string) => {
  return useQuery({
    queryKey: ['friend-requests', 'outgoing', userId],
    queryFn: async () => {
      const response = await apiService.getOutgoingFriendRequests(userId)
      if (response.success && response.outgoing_requests) {
        return response.outgoing_requests.map(transformApiFriendToAppUser)
      }
      return []
    },
    enabled: !!userId,
  })
}

export const useAddFriendRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ requesterId, receiverSlug }: { requesterId: string; receiverSlug: string }) =>
      apiService.addFriendRequest(requesterId, receiverSlug),
    onSuccess: (_, { requesterId }) => {
      queryClient.invalidateQueries({ queryKey: ['friends', requesterId] })
      queryClient.invalidateQueries({ queryKey: ['friend-requests', 'outgoing', requesterId] })
    },
  })
}

export const useConfirmFriendRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ receiverId, requesterId }: { receiverId: string; requesterId: string }) =>
      apiService.confirmFriendRequest(receiverId, requesterId),
    onSuccess: (_, { receiverId, requesterId }) => {
      queryClient.invalidateQueries({ queryKey: ['friends', receiverId] })
      queryClient.invalidateQueries({ queryKey: ['friends', requesterId] })
      queryClient.invalidateQueries({ queryKey: ['friend-requests', 'incoming', receiverId] })
    },
  })
}

export const useRemoveFriend = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, otherUserSlug }: { userId: string; otherUserSlug: string }) =>
      apiService.removeFriend(userId, otherUserSlug),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['friends', userId] })
    },
  })
}

// Number hooks
export const useAddNumber = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => apiService.addNumber(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
    },
  })
}

export const useRemoveLastNumber = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => apiService.removeLastNumber(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
    },
  })
}

export const useRemoveAllNumbers = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => apiService.removeAllNumbers(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
    },
  })
}
