import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { IGame, IGameContext } from '@/types/game'

const defaultGame: IGame = {
  currentPlate: 1,
  streak: 0,
}

const GameContext = createContext<IGameContext>({
  game: defaultGame,
  saveGame: () => {},
})

const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [game, setGame] = useState(defaultGame)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    const storedGame = localStorage.getItem('PS_game')
    if (storedGame) {
      setGame(JSON.parse(storedGame))
    }
  }, [])

  const saveGame = useCallback(
    (game: IGame) => {
      setGame(game)
      localStorage.setItem('PS_game', JSON.stringify(game))
      if (game.findings?.length) {
        if (game.currentPlate === game.findings?.length) {
          setStreak(streak + 1)
        } else {
          setStreak(0)
        }
      }
    },
    [streak]
  )

  const value = useMemo(() => ({ game, streak, saveGame }), [game, streak, saveGame])

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}

export default GameProvider
