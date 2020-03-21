import * as React from 'react';
import './App.css'
import { Card, Color, Shape, Fill, Player } from './types';
import { shuffleArray } from './utils/array';
import { PlayBoard } from './components/PlayBoard'
import { PlaySettngs } from './components/PlaySettngs'
import { getRandom } from './utils/random';
import { Firebase } from './firebase';

const MAX_CARDS_SHOWN = 12
const AMOUNT_SHAPES = 3

const firebase = new Firebase()

interface State {
  cards: Card[]
  selfSets: Card[][]
  otherSets: Card[][]
  points: number
  pointsBot: number
}

export class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      points: 0,
      pointsBot: 0,
      selfSets: [],
      otherSets: [],
      cards: []
    }
  }

  async componentWillMount() {
    if (this.gameIsNew) {
      await this.setShuffledCards(this.cardsNew)
      await firebase.setGameCards(this.state.cards)
    } else {
      const cards = await firebase.getGameCards()
      const sets = await firebase.getGameSets()
      this.setState({ cards, selfSets: sets })
      this.setState({ points: sets.length })
    }
  }

  componentDidUpdate() {
    firebase.setGameCards(this.state.cards)
    firebase.setGameSets(this.state.selfSets)
  }

  get gameId(): string {
    return window.location.search.includes('?game=') ? window.location.search.split('?game=')[1] : ''
  }

  get gameIsNew(): boolean {
    return this.gameId === ''
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
    this.setState({ cards: shuffleArray(cards) })
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

  validate(cards: Card[], player: Player) {
    if (this.getIsSet(cards) === false) {
      this.addPoint(false, player)
    } else {
      this.addPoint(true, player)
      this.addSet(player, cards)
      this.removeCards(cards)
    }
  }

  addSet(player: Player, cards: Card[]) {
    if (player === Player.SELF) {
      this.setState({
        selfSets: [
          ...this.state.selfSets,
          cards,
        ]
      })
    } else if (player === Player.OTHER) {
      this.setState({
        otherSets: [
          ...this.state.otherSets,
          cards,
        ]
      })
    }
  }

  addPoint(isPointAdded: boolean, player: Player) {
    if (player === Player.SELF) {
      if (isPointAdded) {
        this.setState({ points: this.state.points + 1 })
      } else {
        this.setState({ points: this.state.points - 1 })
      }
    } else if (player === Player.OTHER) {
      if (isPointAdded) {
        this.setState({ pointsBot: this.state.pointsBot + 1 })
      } else {
        this.setState({ pointsBot: this.state.pointsBot - 1 })
      }
    }
  }

  removeCards(cards: Card[]) {
    this.setState({
      cards: this.state.cards.filter((c) => !cards.map((c) => c.id).includes(c.id))
    })
  }

  enableBot() {
    setTimeout(() => {
      if (this.cardCombinationsSets[0]) {
        this.validate(this.cardCombinationsSets[0], Player.OTHER)
      }

      this.enableBot()
    }, getRandom(5000, 20000));
  }


  render() {
    return (
      <div className="app">
        <PlaySettngs
          points={this.state.points}
          cardsLeft={this.state.cards.length}
          enableBot={() => this.enableBot()}
          pointsBot={this.state.pointsBot}
          shuffle={() => this.setShuffledCards(this.state.cards)}
        />
        <PlayBoard
          cards={this.cardsShown}
          onValidate={(cards) => this.validate(cards, Player.SELF)}
        />
      </div>
    );
  }
}
