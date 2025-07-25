export type IFindings = {
  plate: number
  foundAt: number
}

export type IGame = {
  currentPlate: number
  streak?: number
  findings?: IFindings[]
}

export type IGameContext = {
  game: IGame
  saveGame: (game: IGame) => void
}
