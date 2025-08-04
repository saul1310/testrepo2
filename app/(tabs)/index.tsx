import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ROWS = 6;
const COLS = 7;

type Player = '' | 'R' | 'Y';

const Connect4: React.FC = () => {
  const [board, setBoard] = useState<Player[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(''))
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>('R');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winnerName, setWinnerName] = useState<string>(''); 

  const checkWinner = (b: Player[][]): Player | null => {
    const directions = [
      [0, 1],   // right
      [1, 0],   // down
      [1, 1],   // diag right-down
      [1, -1],  // diag left-down
    ];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const player = b[r][c];
        if (!player) continue;

        for (const [dr, dc] of directions) {
          let win = true;
          for (let i = 1; i < 4; i++) {
            const nr = r + dr * i;
            const nc = c + dc * i;
            if (
              nr < 0 || nr >= ROWS ||
              nc < 0 || nc >= COLS ||
              b[nr][nc] !== player
            ) {
              win = false;
              break;
            }
          }
          if (win) return player;
        }
      }
    }

    return null;
  };

  const handlePress = (col: number) => {
    if (gameOver) return;

    const newBoard = board.map(row => [...row]);

    for (let row = ROWS - 1; row >= 0; row--) {
      if (!newBoard[row][col]) {
        newBoard[row][col] = currentPlayer;

        const winner = checkWinner(newBoard);
        setBoard(newBoard);

        if (winner) {
          setGameOver(true);
          setWinnerName(winner === 'R' ? '🔴 Red' : '🟡 Yellow'); 
          Alert.alert(
            `Player ${winner === 'R' ? 'Red' : 'Yellow'} wins!`,
            '',
            [{ text: 'Reset', onPress: resetGame }]
          );
        } else {
          setCurrentPlayer(currentPlayer === 'R' ? 'Y' : 'R');
        }

        return;
      }
    }
  };

  const resetGame = () => {
    setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill('')));
    setCurrentPlayer('R');
    setGameOver(false);
  
  };

  return (
    <View style={styles.container}>
      <Text style={styles.turnText}>
        {gameOver
          ? 'Game Over!'
          : `Current Turn: ${currentPlayer === 'R' ? '🔴 Red' : '🟡 Yellow'}`}
      </Text>

      <View style={styles.grid}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                style={styles.cell}
                onPress={() => handlePress(colIndex)}
              >
                <View
                  style={[
                    styles.disc,
                    cell === 'R'
                      ? { backgroundColor: 'red' }
                      : cell === 'Y'
                      ? { backgroundColor: 'gold' }
                      : { backgroundColor: 'white' },
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

    
      {gameOver && (
        <Text style={styles.winnerText}>
          🎉 Winner: {winnerName}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  turnText: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    marginBottom: 20,
  },
  grid: {
    backgroundColor: 'navy',
    padding: 6,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 50,
    height: 50,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disc: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: 'black',
  },
  winnerText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
});

export default Connect4;
