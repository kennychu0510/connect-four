import { cloneDeep, isEmpty, pick } from "lodash"

export const COLOR = {
  RED: 'red' as const,
  YELLOW: 'yellow' as const
}
export type CellState = null | 'yellow' | 'red'
export type Board = CellState[][]

const COL = 7

export function addPieceToBoard(col: number, board: Board, player: typeof COLOR.RED | typeof COLOR.YELLOW) {
  const newBoard = cloneDeep(board)

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

function getCellsAvailable(board: Board): number {
  let available = 0

  board.forEach(row => {
    available += row.filter(cell => cell == null).length
  })

  return available
}

function gameEnd(board: Board): boolean {
  return board.filter(cell => cell == null).length === 0
}

export function getPlayer(board: Board): 'red' | 'yellow' {
  return getRound(board) % 2 === 0 ? COLOR.RED : COLOR.YELLOW
}

export function checkForWinner(board: Board, row: number, col: number, connect: number = 4) {
  const player = board[row][col]
  if (!player) return null

  // check horizontal
  outer:
  for (let offset = 0; offset < connect; offset++) {
    for (let i = 0; i < connect; i++) {
      if (board[row][col + i - offset] != player) continue outer
    }
    return player
  }

  // check for vertical
  outer:
  for (let offset = 0; offset < connect; offset++) {
    for (let i = 0; i < connect; i++) {
      if (!board[row + i - offset]) continue outer
      if (board[row + i - offset][col] != player) continue outer
    }
    return player
  }

  // check for diagonal left to right
  outer:
  for (let offset = 0; offset < connect; offset++) {
    for (let i = 0; i < connect; i++) {
      if (!board[row + i - offset]) continue outer
      if (board[row + i - offset][col + i - offset] != player) continue outer
    }
    return player
  }

  // check for diagonal right to left
  outer:
  for (let offset = 0; offset < connect; offset++) {
    for (let i = 0; i < connect; i++) {
      if (!board[row + i - offset]) continue outer
      if (board[row + i - offset][col - i + offset] != player) continue outer
    }
    return player
  }

  return null
}

function checkForConnection(board: Board, row: number, col: number, player: "red" | "yellow"): number | void {
  for (let i = 3; i > 1; i--) {
    if (checkForWinner(board, row, col, i) === player) return i
  }
}

export function makeMove(board: Board): number | null {
  const AI = COLOR.YELLOW
  const HUMAN = COLOR.RED

  let winningMove = findWinningMove(AI)
  if (winningMove != null) {
    console.log('winning move')
    return winningMove
  }

  let preventLossMove = preventLoss()
  if (preventLossMove != null) {
    console.log('prevent loss')
    return preventLossMove
  }

  const cell = pickCell()
  if (cell != null) {
    console.log('pick cell')
    return cell
  }

  return findAvailableMove()

  function findWinningMove(player: "red" | "yellow"): null | number {
    for (let i = 0; i < COL; i++) {
      const result = addPieceToBoard(i, board, player)
      if (result.success && result.location) {
        const winner = checkForWinner(result.newBoard, result.location.row, result.location.col)
        if (winner === player) {
          return i
        }
      }
    }
    return null
  }

  function preventLoss() {
    return findWinningMove(HUMAN)
  }

  function pickCell() {
    const connect: { [key: number]: number } = {}
    const block: { [key: number]: number } = {}
    for (let i = 0; i < COL; i++) {
      const resultForAI = addPieceToBoard(i, board, AI)
      const resultForHuman = addPieceToBoard(i, board, HUMAN)
      if (resultForAI.success && resultForAI.location) {
        const result = checkForConnection(resultForAI.newBoard, resultForAI.location.row, resultForAI.location.col, AI)
        if (result) {
          connect[i] = result
        }
      }
      if (resultForHuman.success && resultForHuman.location) {
        const result = checkForConnection(resultForHuman.newBoard, resultForHuman.location.row, resultForHuman.location.col, HUMAN)
        if (result) {
          block[i] = result
        }
      }
    }

    function getMaxByValue(object: {[key: number]: number}) {
      const max = Object.entries(object).reduce((prev, cur) => {
        if (prev[1] > cur[1]) return prev
        else return cur
      })
      return max
    }
    if (!isEmpty(connect) && !isEmpty(block)){
      const maxConnection = getMaxByValue(connect)
      const maxBlock = getMaxByValue(block)

      if (maxBlock > maxConnection) {
        return Number(maxBlock[0])
      }
      return Number(maxConnection[0])
    } else if (isEmpty(connect) && isEmpty(block)) {
      return null
    } else if (!isEmpty(connect)) {
      return Number(getMaxByValue(connect)[0])
    } else {
      return Number(getMaxByValue(block)[0])
    }
  }

  function findAvailableMove() {
    for (let i = 0; i < COL; i++) {
      const result = addPieceToBoard(i, board, AI)
      if (result.success) {
        return i
      }
    }
    return null
  }
}

// let board: Board = [
//   [null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null],
//   ['yellow', null, null, null, null, null, null],
//   ['yellow', null, 'red', 'red', null, null, null],
// ]
// console.log(makeMove(board))
