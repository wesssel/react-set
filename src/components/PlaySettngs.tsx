import * as React from 'react';
import { Firebase } from 'src/firebase';

interface Props {
  sets: number
  cardsLeft: number
  playerName: string
  setsAvailable: number
  gameEnded: boolean
  firebase: Firebase
  gameId: string
}

interface State {
  secondsPlayed: number
  showTimer: boolean
}

let timerInterval: NodeJS.Timeout

export class PlaySettngs extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      secondsPlayed: 0,
      showTimer: true,
    }
  }

  async componentDidUpdate() {
    if (this.props.gameEnded === true) {
      clearInterval(timerInterval)

      await this.props.firebase.setPlayerScore({
        secondsPerSet: this.state.secondsPlayed / this.props.sets,
        setsCount: this.props.sets,
        secondsPlayed: this.state.secondsPlayed,
        playerName: this.props.playerName,
      })
      await this.props.firebase.deleteGame(this.props.gameId)
    }
  }

  componentDidMount() {
    timerInterval = setInterval(() => {
      this.setState({ secondsPlayed: this.state.secondsPlayed + 1 })
    }, 1000)
  }

  get timeString(): string {
    const date = new Date(0);
    date.setSeconds(this.state.secondsPlayed);

    return date.toISOString().substr(11, 8);
  }

  toggleTimer() {
    this.setState({ showTimer: !this.state.showTimer })
  }

  render() {
    return (
      <div>
        <ul>
          <li>
            Game ID: {this.props.gameId}
          </li>
          {this.state.showTimer
            ? <li>
              Timeplayed: {this.timeString}
            </li>
            : ''
          }
          <li>
            Sets {this.props.playerName}: {this.props.sets}
          </li>
          <li>
            Card Left: {this.props.cardsLeft}
          </li>
          <li>
            <button onClick={this.toggleTimer.bind(this)}>{this.state.showTimer ? 'Hide Timer' : 'Show Timer'}</button>
          </li>
          <li>
            Current possible sets: {this.props.setsAvailable}
          </li>
        </ul>
      </div>
    );
  }
}
