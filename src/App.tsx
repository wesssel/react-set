import * as React from 'react';
import './App.css'
import { Card, Color, Shape, Fill } from './types';
import { shuffleArray } from './utils/array';
import { PlayBoard } from './components/PlayBoard'
import { PlayScore } from './components/PlayScore'

const MAX_CARDS_SHOWN = 12
const AMOUNT_SHAPES = 3

interface State {
  cards: Card[]
  points: number
}

export class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      points: 0,
      cards: []
    }
  }

  componentWillMount() {
    this.setShuffledCards(this.cardsNew)
  }

  componentDidUpdate() {
    if (this.cardCombinationsSets.length === 0) {
      this.setShuffledCards(this.state.cards)
    }
  }

  get cardsShown(): Card[] {
    return this.state.cards.slice(0, MAX_CARDS_SHOWN)
  }

  get cardsNew(): Card[] {
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

  get cardCombinationsSets(): Card[][] {
    return this.cardCombinations.filter((set: Card[]) => this.getIsSet(set))
  }

  get cardCombinations(): Card[][] {
    const sets: Card[][] = []

    this.cardsShown.forEach((card1) => {
      this.cardsShown.forEach((card2) => {
        this.cardsShown.forEach((card3) => {
          if (
            card1 === card2 ||
            card2 === card3 ||
            card3 === card1 ||
            sets.find((set) => set.includes(card1) && set.includes(card2) && set.includes(card3))
          ) {
            return
          }

          sets.push([card1, card2, card3])
        })
      })
    })

    return sets
  }

  setShuffledCards(cards: Card[]) {
    return this.setState({ cards: shuffleArray(cards) },
      () => {
        console.log(this.cardCombinationsSets.length)

        if (this.cardCombinationsSets.length === 0) {
          this.setShuffledCards(this.state.cards)
        }
      })
  }

  getIsSet(cards: Card[]): boolean {
    const isColorSet = this.getIsUnique(cards, 'color') || this.getIsSame(cards, 'color')
    const isShapeSet = this.getIsUnique(cards, 'shape') || this.getIsSame(cards, 'shape')
    const isFillSet = this.getIsUnique(cards, 'fill') || this.getIsSame(cards, 'fill')
    const isAmountSet = this.getIsUnique(cards, 'amount') || this.getIsSame(cards, 'amount')

    return isColorSet && isShapeSet && isFillSet && isAmountSet
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

  validate(cards: Card[]) { // @move to app
    if (this.getIsSet(cards) === false) {
      this.setState({ points: this.state.points - 1 })
    } else {
      this.setState({ points: this.state.points + 1 })
      this.removeCards(cards)
    }
  }

  removeCards(cards: Card[]) {
    this.setState({
      cards: this.state.cards.filter((c) => !cards.map((c) => c.id).includes(c.id))
    })
  }

  render() {
    return (
      <div className="app">
        <PlayScore points={this.state.points} cardsLeft={this.state.cards.length} />
        <PlayBoard
          cards={this.cardsShown}
          onValidate={(cards) => this.validate(cards)}
        />
      </div>
    );
  }
}
