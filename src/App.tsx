import * as React from 'react';
import './App.css'
import { PlayGame } from './components/PlayGame';
import { PlayStart } from './components/PlayStart';
import { Firebase } from './firebase';

interface State {
  playerName: string
}

const firebase = new Firebase()

export class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      playerName: ''
    }
  }

  startGame(playerName: string) {
    this.setState({ playerName })
  }

  render() {
    return (
      <div className="app">
        {this.state.playerName.length
          ? <PlayGame firebase={firebase} playerName={this.state.playerName} />
          : <PlayStart firebase={firebase} onSubmit={(name: string) => this.startGame(name)} />
        }
      </div>
    );
  }
}
