import type { ApiFriend, ApiUser } from '@/types/api'
import type { IUser } from '@/types/user'

// Convert API user to app user
export const transformApiUserToAppUser = (apiUser: ApiUser): IUser => {
  return {
    id: apiUser.id,
    name: apiUser.name,
    slug: apiUser.slug,
    member_since: apiUser.member_since,
    numbers:
      apiUser.numbers?.map(number => ({
        found_at: number.found_at,
        lat: number.lat,
        lng: number.lng,
      })) || [],
  }
}

// Convert API friend to app user
export const transformApiFriendToAppUser = (apiFriend: ApiFriend, isIncoming = false): IUser => {
  return {
    id: apiFriend.id,
    name: apiFriend.name,
    slug: apiFriend.slug,
    member_since: apiFriend.member_since,
    friendSince: apiFriend.friends_since ? new Date(apiFriend.friends_since).getTime() : undefined,
    requesting: !isIncoming,
    awaiting: isIncoming,
    requested_at: apiFriend.requested_at,
  }
}

// Convert API friend to app user for confirmed friends
export const transformApiFriendToAppUserConfirmed = (apiFriend: ApiFriend): IUser => {
  return {
    id: apiFriend.id,
    name: apiFriend.name,
    slug: apiFriend.slug,
    member_since: apiFriend.member_since,
    friendSince: apiFriend.friends_since ? new Date(apiFriend.friends_since).getTime() : undefined,
    requesting: false,
    awaiting: false,
    requested_at: apiFriend.requested_at,
  }
}
