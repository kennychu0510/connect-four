import { memo, useEffect, useState } from 'react'
import './App.css'
import { cloneDeep } from 'lodash'
import { addPieceToBoard, Board, CellState, checkForWinner, COLOR, getPlayer, getRound, makeMove } from './helper'



function setUpBoard() {
  const board: Board = []
  for (let i = 0; i < 6; i++) {
    const rows = []
    for (let i = 0; i < 7; i++) {
      rows.push(null)
    }
    board.push(rows)
  }
  // const row = new Array(7).fill(null)
  // const board = new Array(6).fill(row) as Board

  return board
}

function App() {
  const [board, setBoard] = useState(setUpBoard())
  const [winner, setWinner] = useState('')
  const [AIMode, setAIMode] = useState(false)

  function onAIModeCheck() {
    setAIMode(mode => !mode)
    setWinner('')
    setBoard(setUpBoard())
  }

  return (
    <div className="App">
      <div className='status'>
        {winner 
        ?
        <>
          <div className={'player cell ' + winner}></div>
          <div>Won!</div>
        </>
        :
        <>
          <div>Player: </div>
          <div className={'player cell ' + getPlayer(board)}></div>
        </>
        }
      </div>
      <br />
      <div className='GameBoard'>
        {board.map((row, rowNum) => {
          return (
            <div key={rowNum} className='row'>
              {row.map((cell: CellState, col) => {
                return  <Cell key={rowNum+col} cell={cell} col={col} row={rowNum} board={board} setBoard={setBoard} setWinner={setWinner} winner={winner} AIMode={AIMode}></Cell>
              })}
            </div>
          )
        })}
      </div>
      <br />
      <div className='mode'>
        <label htmlFor="ai-mode">AI Mode</label>
        <input type="checkbox" id='ai-mode' defaultChecked={AIMode} onClick={onAIModeCheck}/>
      </div>
    </div>
  )
}

const Cell = ((props: {cell: CellState, col: number, row: number, board: CellState[][], setBoard: any, setWinner: any, winner: string, AIMode: boolean}) => {
  const { cell, col, row, board, setBoard, setWinner, winner, AIMode } = props
  // console.log(`[${row}, ${col}] cell is rendered`)
  function handleClick() {
    if (winner) return

    const player = getPlayer(board)
    const {newBoard, success, location } = addPieceToBoard(col, board, player)
    if (success && location) {
      setBoard(newBoard)
      const winner = checkForWinner(newBoard, location.row, location.col)
      if (winner) {
        setWinner(winner)
      }
    }
    if (AIMode) {
      const move = makeMove(newBoard)
      const AI = COLOR.YELLOW
      if (move != null) {
        const { newBoard: newBoard2, success, location } = addPieceToBoard(move, newBoard, AI)
        if (success && location) {
          setBoard(newBoard2)
          const winner = checkForWinner(newBoard2, location.row, location.col)
          if (winner) {
            setWinner(winner)
          }
        }
      }
    }
  }
  return (
    <div 
    className={'cell ' + cell}
    onClick={handleClick}
    >
    </div>
  )
})


export default App
