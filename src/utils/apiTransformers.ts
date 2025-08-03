import type { IUser } from '@/types/user'

// API types for transformers
interface ApiUser {
  id: string
  name: string
  slug: string
  member_since?: string
  numbers?: string[]
  friends?: ApiFriend[]
}

interface ApiFriend {
  id: string
  name: string
  slug: string
  member_since: string
  status?: string
  friends_since?: string
  requested_at?: string
  number_count: number
}

// Convert API user to app user
export const transformApiUserToAppUser = (apiUser: ApiUser): IUser => {
  return {
    id: apiUser.id,
    name: apiUser.name,
    slug: apiUser.slug,
    member_since: apiUser.member_since,
    numbers: apiUser.numbers || [],
  }
}

// Convert API friend to app user
export const transformApiFriendToAppUser = (apiFriend: ApiFriend): IUser => {
  return {
    id: apiFriend.id,
    name: apiFriend.name,
    slug: apiFriend.slug,
    member_since: apiFriend.member_since,
    numbers: [], // API doesn't return numbers for friends
    friendSince: apiFriend.friends_since ? new Date(apiFriend.friends_since).getTime() : undefined,
    requesting: apiFriend.status === 'pending' && !!apiFriend.requested_at,
    awaiting: apiFriend.status === 'pending' && !apiFriend.requested_at,
  }
}
