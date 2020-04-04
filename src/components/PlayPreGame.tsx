import * as React from 'react';
import './PlayPreGame.css'
import { Firebase } from 'src/firebase'
import { Player } from 'src/types';

interface Props {
  gameId: string
  playerName: string
  firebase: Firebase
  startGame: (opponentName: string) => void
}

interface State {
  opponentName: string
  opponentIsReady: boolean
  playerIsReady: boolean
}


export class PlayPreGame extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      opponentName: '',
      opponentIsReady: false,
      playerIsReady: false,
    }
  }

  componentWillMount() {
    this.props.firebase.onGamePlayerUpdate(this.props.gameId)
      .on('value', (snapshots) => {
        snapshots.forEach((snapshot) => {
          const player: Player = {
            ...snapshot.val(),
            playerName: snapshot.key,
          }

          if (this.props.playerName === player.playerName) { return }

          this.setState({ opponentName: player.playerName, opponentIsReady: player.isReady })
          this.startOnReady()
        })
      })
  }

  startOnReady() {
    if (this.state.opponentIsReady && this.state.playerIsReady) {
      this.props.startGame(this.state.opponentName)
    }
  }

  async setIsReady() {
    if (this.state.opponentName.length === 0) {

      return
    }
    await this.setState({ playerIsReady: true })
    await this.props.firebase.setGamePlayerIsReady(this.props.gameId, this.props.playerName)
    this.startOnReady()
  }

  render() {
    return (
      <div className="play-pre-game">
        <h1>Game ID: {this.props.gameId}</h1>
        <h4>Player: {this.props.playerName} {this.state.playerIsReady ? '✅' : ''}</h4>
        {this.state.opponentName.length
          ? <h4>Opponent: {this.state.opponentName} {this.state.opponentIsReady ? '✅' : ''}</h4>
          : ''}
        <small>Copy the ID and send to friend to play together</small>
        <br />
        <button onClick={this.setIsReady.bind(this)}>Start Game</button>
      </div>
    );
  }
}
