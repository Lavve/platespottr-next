'use client'

import { useCallback, useEffect, useState } from 'react'
import type { IHashNavigationState } from '@/types/common'

export const useHashNavigation = () => {
  const [state, setState] = useState<IHashNavigationState>({
    friendSlug: null,
    isAddFriendDialogOpen: false,
    isAddPlateDialogOpen: false,
  })

  const parseHash = useCallback((hash: string): IHashNavigationState => {
    const addFriendHash = hash.match(/^#add-friend=([\w-]+)$/)
    const addPlateHash = hash.match(/^#add-plate$/)

    if (addFriendHash) {
      return {
        friendSlug: addFriendHash[1],
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
