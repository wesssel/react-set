import * as React from 'react';

interface Props {
  points: number
  cardsLeft: number
  shuffle: () => void
}

export class PlayScore extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);

    this.state = {}
  }

  render() {
    return (
      <div>
        <ul>
          <li>
            Points: {this.props.points}
          </li>
          <li>
            Card Left: {this.props.cardsLeft}
          </li>
          <li>
            <button onClick={this.props.shuffle}>Shuffle!</button>
          </li>
        </ul>
      </div>
    );
  }
}
