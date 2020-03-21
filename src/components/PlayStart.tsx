import * as React from 'react';
import './PlayStart.css'
import { Firebase } from 'src/firebase';
import { PlayerScore } from 'src/types';

interface Props {
  firebase: Firebase
  onSubmit: (name: string) => void
}

interface State {
  name: string
  scores: PlayerScore[]
}

export class PlayStart extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      name: '',
      scores: [],
    }
  }

  async componentWillMount() {
    const scores = await this.props.firebase.getPlayerScores()

    this.setState({ scores })
  }

  get scoreSorted(): PlayerScore[] {
    return this.state.scores.sort((a, b) => {
      return b.setsCount - a.setsCount || a.secondsPlayed - b.secondsPlayed 
    })
  }

  handleInput(event: any) {
    this.setState({ name: event.target.value });
  }

  handleSubmit() {
    this.props.onSubmit(this.state.name)
  }

  getTimeString(seconds: number): string {
    const date = new Date(0);
    date.setSeconds(seconds);

    return date.toISOString().substr(11, 8);
  }

  render() {
    const scores = this.scoreSorted.map((score, index) =>
      <li key={index}>{score.playerName}: {score.setsCount} sets in {this.getTimeString(score.secondsPlayed)}</li>
    )

    return (
      <div className="play-start">
        <h1>Set!</h1>
        <input type="text" placeholder="Name" onChange={this.handleInput.bind(this)} />
        {this.state.name.length ? <button onClick={this.handleSubmit.bind(this)}>Start!</button> : ''}

        <ol>
          {scores}
        </ol>
      </div>
    );
  }
}
