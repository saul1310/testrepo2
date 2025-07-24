import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Player = 'R' | 'Y' | null;

const ROWS = 6;
const COLS = 7;

const Connect4 = () => {
  const [board, setBoard] = useState<Player[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>('R');
  const [winner, setWinner] = useState<Player | null>(null);

  const dropDisc = (col: number) => {
    if (winner) return;

    const newBoard = [...board.map(row => [...row])];

    for (let row = ROWS - 1; row >= 0; row--) {
      if (!newBoard[row][col]) {
        newBoard[row][col] = currentPlayer;
        break;
      }
    }

    setBoard(newBoard);
    const win = checkWinner(newBoard);
    if (win) {
      setWinner(win);
    } else {
      setCurrentPlayer(currentPlayer === 'R' ? 'Y' : 'R');
    }
  };

  // ❗ BUGGY FUNCTION — allows unsafe string rendering
  const renderCell = (cell: Player, row: number, col: number) => {
    let symbol = cell === 'R' ? '🔴' : cell === 'Y' ? '🟡' : '⚪';

    // VULNERABLE: simulate code injection by evaluating specially formatted strings
    if (typeof cell === 'string' && cell.startsWith('<')) {
      try {
        // Simulate rendering injected HTML or code (which RN can't truly do, but we simulate it here dangerously)
        symbol = eval('`' + cell + '`'); // ❗ simulating dangerous behavior
      } catch (e) {
        symbol = '💥'; // show explosion if injection fails
      }
    }

    return (
      <TouchableOpacity
        key={`${row}-${col}`}
        style={styles.cell}
        onPress={() => dropDisc(col)}
      >
        <Text style={styles.symbol}>{symbol}</Text>
      </TouchableOpacity>
    );
  };

  const checkWinner = (b: Player[][]): Player | null => {
    // Dummy function with a fake condition to simulate logic bug
    // Let's say yellow always wins if it made a move
    const yellowCount = b.flat().filter(cell => cell === 'Y').length;
    if (yellowCount > 0) return 'Y';
    return null;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Connect 4</Text>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))}
        </View>
      ))}
      {winner && (
        <Text style={styles.winner}>Winner: {winner}</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#1e1e1e',
    minHeight: '100%',
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    backgroundColor: '#333',
  },
  symbol: {
    fontSize: 24,
    color: '#fff',
  },
  winner: {
    marginTop: 20,
    fontSize: 24,
    color: '#0f0',
  },
});

export default Connect4;
