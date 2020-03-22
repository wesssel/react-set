import * as React from 'react';
import './App.css'
import { PlayGame } from './components/PlayGame';
import { PlayStart } from './components/PlayStart';
import { PlayPreGame } from './components/PlayPreGame'
import { Firebase } from './firebase';

interface State {
  playerName: string
  opponentName: string
  gameId: string
  gameIsNew: boolean
  gameStarted: boolean
}

const firebase = new Firebase()

export class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      playerName: '',
      opponentName: '',
      gameId: '',
      gameIsNew: true,
      gameStarted: false,
    }
  }

  async setPlayer(playerName: string, gameId: string) {
    if (gameId === '') {
      await this.setState({ playerName, gameId: 'test-game' }) // Math.random().toString(36).substr(2, 9)
    } else {
      await this.setState({ playerName, gameId, gameIsNew: false })
    }

    await firebase.setGamePlayerJoined(this.state.gameId, this.state.playerName)
  }

  async startGame(opponentName: string) {
    if (opponentName.length) {
      await this.setState({ opponentName })
    }

    this.setState({ gameStarted: true })
  }

  get currentView() {
    if (this.state.gameStarted === true) {
      return <PlayGame
        firebase={firebase}
        gameIsNew={this.state.gameIsNew}
        gameId={this.state.gameId}
        playerName={this.state.playerName}
      />
    }

    if (this.state.gameId.length) {
      return <PlayPreGame
        startGame={(opponentName: string) => this.startGame(opponentName)}
        firebase={firebase}
        playerName={this.state.playerName}
        gameId={this.state.gameId}
      />
    }

    return <PlayStart
      firebase={firebase}
      onSubmit={(name: string, gameId: string) => this.setPlayer(name, gameId)}
    />
  }

  render() {
    return (
      <div className="app">
        {this.currentView}
      </div>
    );
  }
}
