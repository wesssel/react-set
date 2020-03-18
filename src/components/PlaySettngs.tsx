import * as React from 'react';

interface Props {
  points: number
  pointsBot: number
  cardsLeft: number
  shuffle: () => void
  enableBot: () => void
}

interface State {
  secondsPlayed: number
  showTimer: boolean
  isBotEnabled: boolean
}

export class PlaySettngs extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      secondsPlayed: 0,
      showTimer: true,
      isBotEnabled: false
    }
  }

  componentDidMount() {
    setInterval(() => {
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

  enableBot() {
    this.setState({ isBotEnabled: true })
    this.props.enableBot()
  }

  render() {
    return (
      <div>
        <ul>
          {this.state.showTimer
            ? <li>
              Timeplayed: {this.timeString}
            </li>
            : ''
          }
          <li>
            Points: {this.props.points}
          </li>
          {this.state.isBotEnabled
            ?
            <li>
              Bot Points: {this.props.pointsBot}
            </li>
            : ''
          }
          <li>
            Card Left: {this.props.cardsLeft}
          </li>
          <li>
            <button onClick={this.props.shuffle}>Shuffle!</button>
          </li>
          <li>
            <button onClick={this.toggleTimer.bind(this)}>{this.state.showTimer ? 'Hide Timer' : 'Show Timer'}</button>
          </li>
          {this.state.isBotEnabled === false
            ?
            <li>
              <button onClick={this.enableBot.bind(this)}>Play Against Bot</button>
            </li>
            : ''
          }
        </ul>
      </div>
    );
  }
}
