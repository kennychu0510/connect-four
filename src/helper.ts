export const COLOR = {
  RED: 'red' as const,
  YELLOW: 'yellow' as const
}
export type CellState = null | 'yellow' | 'red'
export type Board = CellState[][]

export function addPieceToBoard(col: number, board: Board, player: typeof COLOR.RED | typeof COLOR.YELLOW) {
  const newBoard = [...board]

  let bottomRow = board.length - 1
  while (newBoard[bottomRow][col] != null && bottomRow > -1) {
    bottomRow--
    if (bottomRow < 0) {
      return { newBoard, success: false }
    }
  }

  newBoard[bottomRow][col] = player
  return { newBoard, success: true, location: { row: bottomRow, col } }

}

export function getRound(board: Board): number {
  let round = 0

  board.forEach(row => {
    round += row.filter(cell => cell != null).length
  })

  return round
}

export function getPlayer(board: Board): 'red' | 'yellow' {
  return getRound(board) % 2 === 0 ? COLOR.RED : COLOR.YELLOW
}

export function checkForWinner(board: Board, row: number, col: number) {
  const player = board[row][col]
  if (!player) return null

  // check horizontal
  outer:
  for (let offset = 0; offset < 4; offset++) {
    for (let i = 0; i < 4; i++) {
      if (board[row][col + i - offset] != player) continue outer
    }
    return player
  }

  // check for vertical
  outer:
  for (let offset = 0; offset < 4; offset++) {
    for (let i = 0; i < 4; i++) {
      if (!board[row + i - offset]) continue outer
      if (board[row + i - offset][col] != player) continue outer
    }
    return player
  }

  // check for diagonal left to right
  outer:
  for (let offset = 0; offset < 4; offset++) {
    for (let i = 0; i < 4; i++) {
      if (!board[row + i - offset]) continue outer
      if (board[row + i - offset][col + i - offset] != player) continue outer
    }
    return player
  }

  // check for diagonal right to left
  outer:
  for (let offset = 0; offset < 4; offset++) {
    for (let i = 0; i < 4; i++) {
      if (!board[row + i - offset]) continue outer
      if (board[row + i - offset][col - i + offset] != player) continue outer
    }
    return player
  }

  return null
}
