import { createContext, useContext, useMemo, useState } from 'react'

type Game = {
  currentPlate: number
}

const GameContext = createContext({
  game: {
    currentPlate: 1,
  },
  setGame: (game: Game) => {},
})

const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [game, setGame] = useState({
    currentPlate: 1,
  })

  const value = useMemo(() => ({ game, setGame }), [game])

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export const useGame = () => {
  return useContext(GameContext)
}

export default GameProvider
