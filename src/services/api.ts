import type {
  FriendsResponse,
  IncomingRequestsResponse,
  MessageResponse,
  OutgoingRequestsResponse,
  StatusResponse,
  UserResponse,
} from '@/types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ps-api.lavve.net/api'

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', errorText)
      throw new ApiError(
        `API request failed: ${response.status} ${response.statusText}`,
        response.status,
        response.statusText
      )
    }

    const data = await response.json()

    return data
  }

  // Authentication
  async login(name: string, pin: string): Promise<UserResponse> {
    return this.request<UserResponse>('/login.php', {
      method: 'POST',
      body: JSON.stringify({ name, pin }),
    })
  }

  async logout(userId: string): Promise<MessageResponse> {
    try {
      return await this.request<MessageResponse>('/logout.php', {
        method: 'POST',
        body: JSON.stringify({ userId }),
      })
    } catch (error) {
      console.warn('Logout API call failed, but continuing with local logout:', error)
      // Return a success response even if the API call fails
      // This allows the app to continue working even if the logout endpoint doesn't exist
      return { success: true, message: 'Logged out locally' }
    }
  }

  // User management
  async createUser(name: string, pin: string): Promise<UserResponse> {
    return this.request<UserResponse>('/user.php', {
      method: 'POST',
      body: JSON.stringify({ name, pin }),
    })
  }

  async getUser(userId?: string, slug?: string, details = false): Promise<UserResponse> {
    const params = new URLSearchParams()
    if (userId) params.append('userId', userId)
    if (slug) params.append('slug', slug)
    if (details) params.append('details', 'true')

    return this.request<UserResponse>(`/user.php?${params.toString()}`)
  }

  async deleteUser(userId: string, pin: string): Promise<MessageResponse> {
    return this.request<MessageResponse>('/user.php', {
      method: 'DELETE',
      body: JSON.stringify({ userId, pin }),
    })
  }

  // Friend management
  async addFriendRequest(requesterId: string, receiverSlug: string): Promise<MessageResponse> {
    return this.request<MessageResponse>('/add-friend.php', {
      method: 'POST',
      body: JSON.stringify({ requesterId, receiverSlug }),
    })
  }

  async confirmFriendRequest(receiverId: string, requesterId: string): Promise<MessageResponse> {
    return this.request<MessageResponse>('/confirm-friend.php', {
      method: 'POST',
      body: JSON.stringify({ receiverId, requesterId }),
    })
  }

  async getFriends(userId: string): Promise<FriendsResponse> {
    return this.request<FriendsResponse>(`/friends.php?userId=${userId}`)
  }

  async getFriendStatus(userId: string, otherUserId: string): Promise<StatusResponse> {
    return this.request<StatusResponse>(`/friend-status.php?userId=${userId}&otherUserId=${otherUserId}`)
  }

  async removeFriend(userId: string, otherUserSlug: string): Promise<MessageResponse> {
    return this.request<MessageResponse>('/friend.php', {
      method: 'DELETE',
      body: JSON.stringify({ userId, otherUserSlug }),
    })
  }

  async getIncomingFriendRequests(userId: string): Promise<IncomingRequestsResponse> {
    return this.request<IncomingRequestsResponse>(`/friend-requests/incoming.php?userId=${userId}`)
  }

  async getOutgoingFriendRequests(userId: string): Promise<OutgoingRequestsResponse> {
    return this.request<OutgoingRequestsResponse>(`/friend-requests/outgoing.php?userId=${userId}`)
  }

  // Number management
  async addNumber(userId: string): Promise<MessageResponse> {
    return this.request<MessageResponse>('/user-numbers.php', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    })
  }

  async removeLastNumber(userId: string): Promise<MessageResponse> {
    return this.request<MessageResponse>('/user-numbers.php', {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    })
  }

  async removeAllNumbers(userId: string): Promise<MessageResponse> {
    return this.request<MessageResponse>('/user-numbers.php', {
      method: 'DELETE',
      body: JSON.stringify({ userId, removeAll: true }),
    })
  }
}

const apiService = new ApiService()

export default apiService
