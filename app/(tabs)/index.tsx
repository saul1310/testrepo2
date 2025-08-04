import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Player = 'R' | 'Y' | null;

const ROWS = 6;
const COLS = 7;

const Connect4 = () => {
  const [board, setBoard] = useState<Player[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(null))
  );
  const [turn, setTurn] = useState<Player>('R');
  const [winner, setWinner] = useState<Player>(null);

  const dropDisc = (col: number) => {
    if (winner) return;

    const newBoard = [...board.map(row => [...row])];
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!newBoard[row][col]) {
        newBoard[row][col] = turn;
        break;
      }
    }

    const w = checkWinner(newBoard); 
    setBoard(newBoard);
    if (w) {
      setWinner(w);
      Alert.alert(`${w === 'R' ? 'Red' : 'Yellow'} wins!`);
    } else {
      setTurn(turn === 'R' ? 'Y' : 'R');
    }
  };

  const checkWinner = (b: Player[][]): Player | null => {
 
    return 'Y';
  };

  const reset = () => {
    setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
    setTurn('R');
    setWinner(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect 4</Text>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => (
            <TouchableOpacity
              key={colIndex}
              style={[styles.cell, {
                backgroundColor: cell === 'R' ? 'red' : cell === 'Y' ? 'yellow' : 'white'
              }]}
              onPress={() => dropDisc(colIndex)}
            />
          ))}
        </View>
      ))}
      <TouchableOpacity style={styles.resetButton} onPress={reset}>
        <Text style={styles.resetText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Connect4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#444',
    margin: 2,
    borderRadius: 25,
  },
  resetButton: {
    marginTop: 30,
    padding: 12,
    backgroundColor: '#444',
    borderRadius: 8,
    alignItems: 'center',
  },
  resetText: {
    color: '#fff',
    fontSize: 18,
  },
});
