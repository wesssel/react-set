import * as React from 'react';
import './App.css'
import { PlayGame } from './components/PlayGame';
import { PlayStart } from './components/PlayStart';

interface State {
  playerName: string
}

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
          ? <PlayGame />
          : <PlayStart onSubmit={(name: string) => this.startGame(name)} />
        }
      </div>
    );
  }
}
