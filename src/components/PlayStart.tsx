import * as React from 'react';
import './PlayStart.css'
import { Firebase } from 'src/firebase';
import { Player } from 'src/types';

interface Props {
  firebase: Firebase
  onSubmit: (name: string, gameId: string) => void
}

interface State {
  name: string
  gameId: string
  scores: Player[]
}

export class PlayStart extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      name: '',
      gameId: '',
      scores: [],
    }
  }

  async componentWillMount() {
    const scores = await this.props.firebase.getPlayerScores()

    this.setState({ scores })
  }

  get scoreSorted(): Player[] {
    return this.state.scores
      .map((score) => {
        score.secondsPerSet = score.secondsPlayed / score.setsCount
        return score
      })
      .sort((a, b) => a.secondsPerSet - b.secondsPerSet)
  }

  get buttonText(): string {
    return this.state.gameId.length ? 'Join Game!' : 'Create Game'
  }

  handleName(event: any) {
    this.setState({ name: event.target.value });
  }

  handleGameId(event: any) {
    this.setState({ gameId: event.target.value });
  }

  handleSubmit() {
    this.props.onSubmit(this.state.name, this.state.gameId)
  }

  getTimeString(seconds: number): string {
    const date = new Date(0);
    date.setSeconds(seconds);

    return date.toISOString().substr(11, 8);
  }

  render() {
    const scores = this.scoreSorted.map((score, index) =>
      <li key={index}>
        {score.playerName}: {score.setsCount}, {this.getTimeString(score.secondsPlayed)} => {score.secondsPerSet.toFixed(2)} seconds per set
      </li>
    )

    return (
      <div className="play-start">
        <h1>Set!</h1>
        <input type="text" placeholder="Name" onChange={this.handleName.bind(this)} />
        <input type="text" placeholder="Join game (optional)" onChange={this.handleGameId.bind(this)} />
        {this.state.name.length ? <button onClick={this.handleSubmit.bind(this)}>{this.buttonText}</button> : ''}
        <ol>
          {scores}
        </ol>
      </div>
    );
  }
}
