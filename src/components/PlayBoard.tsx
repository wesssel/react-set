import * as React from 'react';
import './PlayBoard.css'
import { PlayCard } from './PlayCard'
import { Card } from 'src/types';

interface Props {
  cards: Card[]
  onRemoveCards: (indexes: number[]) => void
}

interface State {
  selectedIndexes: number[]
  isSet?: boolean
  points: number
}

export class PlayBoard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedIndexes: [],
      isSet: undefined,
      points: 0
    }
  }

  get selectedCards(): Card[] {
    return this.state.selectedIndexes.map((i) => this.props.cards[i])
  }

  get isSet(): boolean {
    const isColorSet = this.getIsUnique(this.selectedCards, 'color') || this.getIsSame(this.selectedCards, 'color')
    const isShapeSet = this.getIsUnique(this.selectedCards, 'shape') || this.getIsSame(this.selectedCards, 'shape')
    const isFillSet = this.getIsUnique(this.selectedCards, 'fill') || this.getIsSame(this.selectedCards, 'fill')
    const isAmountSet = this.getIsUnique(this.selectedCards, 'amount') || this.getIsSame(this.selectedCards, 'amount')

    return this.isCardsSelected && isColorSet && isShapeSet && isFillSet && isAmountSet
  }

  get isCardsSelected(): boolean {
    return this.state.selectedIndexes.length === 3
  }

  getIsUnique(array: any[], type: string): boolean {
    return array
      .map((item) => item[type])
      .every((item, i, items) => items.filter(c => c === item).length === 1)
  }

  getIsSame(array: any[], type: string): boolean {
    return array
      .map((item) => item[type])
      .every((color, i, colors) => colors[0] === color)
  }

  handleClick(index: number) {
    if (!this.isCardsSelected) {
      if (!this.state.selectedIndexes.includes(index)) {
        return this.setState({
          selectedIndexes: [...this.state.selectedIndexes, index],
        }, () => {
          if (this.isCardsSelected) {
            this.validate()
          }
        })
      }

      return this.setState({
        selectedIndexes: this.state.selectedIndexes.filter((i) => i !== index)
      })
    }
  }

  validate() {
    if (this.isSet === false) {
      this.setState({ points: this.state.points - 1 })
    } else {
      this.setState({ points: this.state.points + 1 })
      this.props.onRemoveCards(this.state.selectedIndexes)
    }

    this.setState({ selectedIndexes: [] })
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
      <div>
        <div>Points!: {this.state.points}</div>

        <div className="board">
          {cards}
        </div>
      </div>
    );
  }
}
