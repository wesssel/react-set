import * as React from 'react';
import './PlayStart.css'

interface Props {
  onSubmit: (name: string) => void
}

interface State {
  name: string
}

export class PlayStart extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      name: '',
    }
  }

  handleInput(event: any) {
    this.setState({ name: event.target.value });
  }

  handleSubmit() {
    this.props.onSubmit(this.state.name)
  }

  render() {
    return (
      <div className="play-start">
        <h1>Set!</h1>
        <input type="text" placeholder="Name" onChange={this.handleInput.bind(this)} />
        {this.state.name.length ? <button onClick={this.handleSubmit.bind(this)}>Start!</button> : ''}
      </div>
    );
  }
}
