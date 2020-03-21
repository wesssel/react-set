import * as React from 'react';
import './PlayBoard.css'
import { PlayCard } from './PlayCard'
import { Card } from 'src/types';

interface Props {
  cards: Card[]
  onValidate: (cards: Card[]) => void
}

interface State {
  selectedIndexes: number[]
  isSet?: boolean
}

export class PlayBoard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedIndexes: [],
      isSet: undefined,
    }
  }

  componentWillMount() {
    this.handleKeyBoard()
  }

  get cardsSelected(): Card[] {
    return this.state.selectedIndexes.map((i) => this.props.cards[i])
  }

  get isCardCombination(): boolean {
    return this.state.selectedIndexes.length === 3
  }

  handleKeyBoard() {
    document.onkeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        this.setState({ selectedIndexes: [] })
      }
    }
  }

  handleClick(index: number) {
    if (this.isCardCombination) { return }

    if (!this.state.selectedIndexes.includes(index)) {
      return this.setState({
        selectedIndexes: [...this.state.selectedIndexes, index],
      }, () => {
        if (this.isCardCombination) {
          this.props.onValidate(this.cardsSelected)
          this.setState({ selectedIndexes: [] })
        }
      })
    }

    return this.setState({
      selectedIndexes: this.state.selectedIndexes.filter((i) => i !== index)
    })
  }

  render() {
    const cards = this.props.cards.map((card, index) => {
      return (
        <div className="board-card" key={index}>
          <PlayCard
            active={this.state.selectedIndexes.includes(index)}
            card={card}
            onClick={() => this.handleClick(index)}
          />
        </div>
      );
    });

    return (
      <div className="board">
        {cards}
      </div>
    );
  }
}
