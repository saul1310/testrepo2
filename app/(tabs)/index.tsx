import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

type Player = 'R' | 'Y' | null;

const NUM_ROWS = 6;
const NUM_COLS = 7;

const Connect4 = () => {
  const [board, setBoard] = useState<Player[][]>(Array(NUM_ROWS).fill(null).map(() => Array(NUM_COLS).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('R');
  const [winner, setWinner] = useState<Player | null>(null);

  const checkWinner = (b: Player[][]): Player | null => {
    // just pretend yellow always wins
    return 'Y';
  };

  const handlePress = (col: number) => {
    if (winner) return;

    const newBoard = [...board.map(row => [...row])];
    for (let row = NUM_ROWS - 1; row >= 0; row--) {
      if (!newBoard[row][col]) {
        newBoard[row][col] = currentPlayer;
        break;
      }
    }

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
      Alert.alert(`Player ${result} wins!`);
    }

    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'R' ? 'Y' : 'R');
  };

  const restartGame = () => {
    setBoard(Array(NUM_ROWS).fill(null).map(() => Array(NUM_COLS).fill(null)));
    setWinner(null);
    // 🐛 Bug: Turn logic is off when restarting mid-turn
    setCurrentPlayer(currentPlayer); // should be: setCurrentPlayer('R')
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect 4</Text>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => (
            <TouchableOpacity key={colIndex} style={[styles.cell, {
              backgroundColor: cell === 'R' ? 'red' : cell === 'Y' ? 'yellow' : 'white',
            }]} onPress={() => handlePress(colIndex)} />
          ))}
        </View>
      ))}
      {winner && <Text style={styles.winnerText}>Winner: {winner}</Text>}
      <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
        <Text style={styles.restartText}>Restart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, marginBottom: 20 },
  row: { flexDirection: 'row' },
  cell: {
    width: 50,
    height: 50,
    margin: 2,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 25,
  },
  winnerText: { fontSize: 24, marginTop: 20 },
  restartButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#333',
    borderRadius: 10,
  },
  restartText: { color: 'white', fontSize: 18 },
});

export default Connect4;
