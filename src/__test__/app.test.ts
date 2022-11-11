import { describe, expect, test } from '@jest/globals';

import { addPieceToBoard, Board, checkForWinner, COLOR, getRound, makeMove } from '../helper'

const R = 'red'
const Y = 'yellow'

describe('add piece function is working', () => {
  let board: Board = [[null, null], [null, null]]
  beforeEach(() => {
    board = [[null, null], [null, null]]
  })

  test('add piece to bottom row', () => {
    expect(addPieceToBoard(0, board, 'red').newBoard).toEqual([[null, null],['red', null]]);
  });

  test('add piece to top row', () => {
    const newBoard = addPieceToBoard(0, board, 'red').newBoard
    expect(addPieceToBoard(0, newBoard, 'red').newBoard).toEqual([['red', null],['red', null]]);
  });

  test('return same board when column is full', () => {
    let newBoard = addPieceToBoard(0, board, 'red').newBoard
    newBoard = addPieceToBoard(0, newBoard, 'yellow').newBoard
    expect(addPieceToBoard(0, newBoard, 'red').newBoard).toEqual([['yellow', null],['red', null]]);
  });

  test('return success false when cannot make move', () => {
    let fullBoard = [['red', 'red'], ['red', 'red']] as Board
    expect(addPieceToBoard(0, fullBoard, 'red').success).toBe(false);
  });
});

describe('get round is working', () => {
  let board: Board = [[null, null], [null, null]]
  beforeEach(() => {
    board = [[null, null], [null, null]]
  })

  test('when board is empty, should equal 0', () => {
    expect(getRound(board)).toBe(0);
  });

  test('when board is full, should equal board size', () => {
    board = [['red', 'red'], ['red', 'red']]
    expect(getRound(board)).toBe(4);
  });

});

describe('check for winner is working', () => {
  
  test('winner should be red', () => {
    let board: Board = [
      [null, null, null, null, null, null, null], 
      [null, null, null, null, null, null, null], 
      [null, null, null, null, null, null, null], 
      [null, null, null, null, null, null, null], 
      [null, null, null, null, null, null, null], 
      ['red', 'red', 'red', 'red', null, null, null], 
      ]
    expect(checkForWinner(board, 5, 0)).toBe(COLOR.RED);
  });

  test('winner should be red', () => {
    let board: Board = [
      [null, null, null, null, null, null, null], 
      [null, null, null, null, null, null, null], 
      [null, null, null, null, null, null, null], 
      [null, null, null, null, null, null, null], 
      [null, null, null, null, null, null, null], 
      [null, 'red', 'red', 'red', 'red', null, null], 
      ]
    expect(checkForWinner(board, 5, 2)).toBe(COLOR.RED);
  });

  test('winner should be null', () => {
    let board: Board = [
      [null, null, null, null, null, null, null], 
      [null, null, null, null, null, null, null], 
      [null, null, null, null, null, null, null], 
      [null, null, null, null, null, null, null], 
      [null, null, null, null, null, null, null], 
      [null, 'red', 'red', 'red', null, null, null], 
      ]
    expect(checkForWinner(board, 5, 3)).toBe(null);
  });

  test('vertical check', () => {
    let board: Board = [
      [null, null, null, null, null, null, null], 
      [null, 'red', null, null, null, null, null], 
      [null, 'red', null, null, null, null, null], 
      [null, 'red', null, null, null, null, null], 
      [null, 'red', null, null, null, null, null], 
      [null, null, 'red', 'red', null, null, null], 
      ]
    expect(checkForWinner(board, 4, 1)).toBe('red');
  });

  test('vertical check', () => {
    let board: Board = [
      [null, null, null, null, null, null, 'red'], 
      [null, 'red', null, null, null, null, 'red'], 
      [null, 'red', null, null, null, null, 'red'], 
      [null, 'red', null, null, null, null, 'red'], 
      [null, null, null, null, null, null, null], 
      [null, null, 'red', 'red', null, null, null], 
      ]
    expect(checkForWinner(board, 0, 6)).toBe('red');
  });

  test('diagonal check', () => {
    let board: Board = [
      [null, null, null, null, null, null, 'red'], 
      [null, 'red', null, null, null, null, 'red'], 
      [null, 'red', 'red', null, null, null, 'red'], 
      [null, 'red', null, 'red', null, null, 'red'], 
      [null, null, null, null, 'red', null, null], 
      [null, null, 'red', 'red', null, null, null], 
      ]
    expect(checkForWinner(board, 2, 2)).toBe('red');
  });

  test('diagonal check', () => {
    let board: Board = [
      [null, null, null, null, null, null, 'red'],
      [null, 'red', null, null, null, 'red', 'red'],
      [null, 'red', 'red', null, 'red', null, 'red'],
      [null, 'red', null, 'red', null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, 'red', 'red', null, null, null],
    ]
    expect(checkForWinner(board, 3, 3)).toBe('red');
  });

});

describe('check for winner', () => {
  let board: Board = [['red', 'red'], [null, null]]

  test('check for winner special', () => {
    expect(checkForWinner(board, 0, 0, 2)).toBe('red');
  });

});

describe.only('winning move', () => {
  

  test('check for winning move', () => {
    const board: Board = [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      ['yellow', 'yellow', 'yellow', null, null, null, null],
    ]
    expect(makeMove(board)).toBe(3);
  });

  

  test('no move when board is full', () => {
    const board: Board = [
      ["red", "red", "red", "red", "red", "red", "red"],
      ["red", "red", "red", "red", "red", "red", "red"],
      ["red", "red", "red", "red", "red", "red", "red"],
      ["red", "red", "red", "red", "red", "red", "red"],
      ["red", "red", "red", "red", "red", "red", "red"],
      ['yellow', 'yellow', 'yellow', "red", "red", "red", "red"],
    ]
    expect(makeMove(board)).toBe(null);
  });

  test('prevent loss move', () => {
    const board: Board = [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      ['red', 'red', 'red', null, null, null, null],
    ]
    expect(makeMove(board)).toBe(3);
  });
  
  test('prevent loss move', () => {
    const board: Board = [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, 'red', 'red', 'red', null, null, null],
    ]
    expect(makeMove(board)).toBe(0);
  });

  test.only('prevent loss move', () => {
    const board: Board = [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [Y, Y, null, null, null, null, null],
      [R, R, R, null, null, null, null],
    ]
    expect(makeMove(board)).toBe(3);
  });

});

