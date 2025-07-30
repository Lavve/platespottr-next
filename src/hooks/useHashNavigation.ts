'use client'

import { useCallback, useEffect, useState } from 'react'
import type { IHashNavigationState } from '@/types/common'
import { isValidSlug } from '@/utils/generateSlug'

export const useHashNavigation = () => {
  const [state, setState] = useState<IHashNavigationState>({
    friendSlug: null,
    isAddFriendDialogOpen: false,
    isAddPlateDialogOpen: false,
  })

  const parseHash = useCallback((hash: string): IHashNavigationState => {
    const addFriendHash = hash.match(/^#add-friend=(.+)$/)
    const friendHashDencoded = decodeURIComponent(addFriendHash?.[1] || '')
    const addPlateHash = hash.match(/^#add-plate$/)

    if (addFriendHash && isValidSlug(friendHashDencoded)) {
      return {
        friendSlug: friendHashDencoded,
        isAddFriendDialogOpen: true,
        isAddPlateDialogOpen: false,
      }
    } else if (addPlateHash) {
      return {
        friendSlug: null,
        isAddFriendDialogOpen: false,
        isAddPlateDialogOpen: true,
      }
    } else {
      return {
        friendSlug: null,
        isAddFriendDialogOpen: false,
        isAddPlateDialogOpen: false,
      }
    }
  }, [])

  const clearHash = useCallback(() => {
    window.history.replaceState({}, '', '/')
    setState({
      friendSlug: null,
      isAddFriendDialogOpen: false,
      isAddPlateDialogOpen: false,
    })
  }, [])

  useEffect(() => {
    const handleHashChange = () => {
      const newState = parseHash(window.location.hash)
      setState(newState)
    }

    // Initial check
    handleHashChange()

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [parseHash])

  return {
    ...state,
    clearHash,
  }
}
