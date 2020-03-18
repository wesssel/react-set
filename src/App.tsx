import * as React from 'react';
import './App.css'
import { Card, Color, Shape, Fill } from './types';
import { shuffleArray } from './utils/array';
import { PlayBoard } from './components/PlayBoard'

const MAX_CARDS_SHOWN = 12
const AMOUNT_SHAPES = 3

interface AppState {
  cards: Card[]
}

export class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      cards: []
    }
  }

  componentWillMount() {
    this.setState({ cards: shuffleArray(this.newCards) })
  }

  get cardsShown(): Card[] {
    return this.state.cards.slice(0, MAX_CARDS_SHOWN)
  }

  get newCards(): Card[] {
    const cards: Card[] = []

    Object.values(Fill).forEach((fill) => {
      Object.values(Shape).forEach((shape) => {
        Object.values(Color).forEach((color) => {
          for (let index = 0; index < AMOUNT_SHAPES; index++) {
            cards.push({ color, shape, fill, amount: index + 1, id: cards.length + 1 })
          }
        })
      })
    })

    return cards
  }

  removeCards(indexes: number[]) {
    indexes.forEach((index) => {
      this.setState({
        cards: this.state.cards.filter((_, i) => i !== index)
      })
    })
  }

  render() {
    return (
      <div className="app">
        <PlayBoard
          cards={this.cardsShown}
          onRemoveCards={(indexes) => this.removeCards(indexes)}
        />
      </div>
    );
  }
}
