import * as React from 'react';
import './PlayStart.css'
import { Firebase } from 'src/firebase';
import { PlayerScore } from 'src/types';
import logo from '../assets/take-it.svg';

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

  get isValidName(): boolean {
    return !this.state.name.includes(' ')
  }

  get scoreSorted(): PlayerScore[] {
    return this.state.scores
      .map((score) => {
        score.secondsPerSet = score.secondsPlayed / score.setsCount
        return score
      })
      .sort((a, b) => a.secondsPerSet - b.secondsPerSet)
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
      <li key={index}>
        {score.playerName}: {score.setsCount}, {this.getTimeString(score.secondsPlayed)} => {score.secondsPerSet.toFixed(2)} sec per set
      </li>
    )

    return (
      <div className="play-start">
        <div className="play-start__intro">
          <h1>SET! by</h1>
          <a href="https://takeit.agency/">
            <img src={logo} alt="take it logo" />
          </a>
        </div>

        <input type="text" placeholder="Name" onChange={this.handleInput.bind(this)} />
        {!this.isValidName ? 'No spaces in name' : ''}
        {this.state.name.length && this.isValidName ? <button onClick={this.handleSubmit.bind(this)}>Start!</button> : ''}

        <ol>
          {scores}
        </ol>
        {/* <a href="https://github.com/wesssel/react-set" className="github-logo-link" target="_blank" rel="noopener noreferrer">
          <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" className="github-logo" alt="github" />
        </a> */}
      </div>
    );
  }
}
