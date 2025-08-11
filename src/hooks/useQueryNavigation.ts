'use client'

import { useCallback, useEffect, useState } from 'react'
import type { IQueryNavigationState } from '@/types/common'
import { isValidSlug } from '@/utils/validateSlug'

const DEFALULT_STATE: IQueryNavigationState = {
  friend: null,
  isAddFriendDialogOpen: false,
  isAddPlateDialogOpen: false,
}

export const useQueryNavigation = () => {
  const [state, setState] = useState<IQueryNavigationState>(DEFALULT_STATE)

  const parseQuery = useCallback((): IQueryNavigationState => {
    const params = new URLSearchParams(window.location.search)
    const friendSlug = decodeURIComponent(params.get('add-friend') || '')
    const friendName = decodeURIComponent(params.get('name') || '')
    const addFriend = params.has('add-friend')
    const addPlate = params.has('add-plate')

    if (addFriend && isValidSlug(friendSlug)) {
      return {
        ...DEFALULT_STATE,
        friend: { name: friendName, slug: friendSlug },
        isAddFriendDialogOpen: true,
      }
    } else if (addPlate) {
      return {
        ...DEFALULT_STATE,
        isAddPlateDialogOpen: true,
      }
    } else {
      return DEFALULT_STATE
    }
  }, [])

  const clearQuery = useCallback(() => {
    const url = new URL(window.location.href)
    url.search = ''
    window.history.replaceState({}, '', url.toString())

    setState(DEFALULT_STATE)
  }, [])

  useEffect(() => {
    const handlePopState = () => {
      const newState = parseQuery()
      setState(newState)
    }

    handlePopState()
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [parseQuery])

  return {
    ...state,
    clearQuery,
  }
}
