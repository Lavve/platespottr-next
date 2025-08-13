// API types for external API communication

import type { ISettings } from '@/types/settings'

export interface ApiNumber {
  found_at: string
  lat: string | null
  lng: string | null
}

export interface ApiUser {
  id: string
  name: string
  slug: string
  member_since?: string
  numbers?: ApiNumber[]
  friends?: ApiFriend[]
}

export interface ApiFriend {
  id: string
  name: string
  slug: string
  member_since: string
  status?: 'pending' | 'accepted' | 'rejected'
  friends_since?: string
  requested_at?: string
  number_count: number
}

// API response types
export interface UserResponse {
  success: boolean
  message?: string
  user?: ApiUser
}

export interface FriendsResponse {
  success: boolean
  message?: string
  friends?: ApiFriend[]
}

export interface IncomingRequestsResponse {
  success: boolean
  message?: string
  incoming_requests?: ApiFriend[]
}

export interface OutgoingRequestsResponse {
  success: boolean
  message?: string
  outgoing_requests?: ApiFriend[]
}

export interface MessageResponse {
  success: boolean
  message?: string
}

export interface StatusResponse {
  success: boolean
  status?: string
}

export interface SettingsResponse {
  success: boolean
  settings: ISettings
  created_at: string
  updated_at: string
}
