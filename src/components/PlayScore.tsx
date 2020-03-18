import * as React from 'react';

interface Props {
  points: number
  cardsLeft: number
  shuffle: () => void
}

interface State {
  secondsPlayed: number
  showTimer: boolean
}

export class PlayScore extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      secondsPlayed: 0,
      showTimer: true
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
          <li>
            Card Left: {this.props.cardsLeft}
          </li>
          <li>
            <button onClick={this.props.shuffle}>Shuffle!</button>
          </li>
          <li>
            <button onClick={this.toggleTimer.bind(this)}>{this.state.showTimer ? 'Hide Timer' : 'Show Timer'}</button>
          </li>
        </ul>
      </div>
    );
  }
}
