import * as React from 'react';
import { Card, Color, Shape, Fill, Player } from '../types';
import { shuffleArray } from '../utils/array';
import { PlayBoard } from '../components/PlayBoard'
import { PlayStats } from '../components/PlayStats'
import { Firebase } from '../firebase';
import { sleep } from 'src/utils/sleep';

const MAX_CARDS_SHOWN = 12
const AMOUNT_SHAPES = 3

interface Props {
  gameIsNew: boolean
  gameId: string
  playerName: string
  opponentName: string
  firebase: Firebase
}

interface State {
  cards: Card[]
  sets: Card[][]
  opponentSets: Card[][]
  gameEnded: boolean
  gameStarted: boolean
}

export class PlayGame extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      sets: [],
      opponentSets: [],
      cards: [],
      gameEnded: false,
      gameStarted: false,
    }
  }

  componentWillMount() {
    // this.props.firebase.onCardUpdate(this.props.gameId);

    if (this.props.gameIsNew) {
      this.startGame()
    } else {
      this.joinGame()
    }

    this.subscribeOpponentSets()
    // (document as any).addEventListener('cardsUpdate', (event: { detail: Card[] }) => {
    //   // console.log({ event })
    //   // if (JSON.stringify(this.state.cards) === JSON.stringify(event.detail)) { return }

    //   this.setState({ cards: event.detail })
    // })
    // await sleep(500) // delay till cards are loaded

    // if (this.props.gameIsNew) {
    //   console.log('isnew')
    //   await this.setShuffledCards(this.cardsNew)
    //   await this.props.firebase.setGameCards(this.props.gameId, this.state.cards)
    //   await this.setState({ gameStarted: true })
    // } else {
    //   console.log('isexisting')
    //   const cards = await this.props.firebase.getGameCards(this.props.gameId)
    //   // console.log(cards)
    //   // const sets = await this.props.firebase.getGameSets(this.props.gameId, this.props.playerName)
    //   await this.setState({ cards })
    //   await this.setState({ gameStarted: true })
    // }

    // setInterval(() => {
    //   if (this.cardCombinationsSets[0]) {
    //     this.validate(this.cardCombinationsSets[0])
    //   }
    // }, 200)
  }

  componentDidUpdate() {
    if (this.state.gameStarted === false) { return }
    this.validateCombinations()
    this.props.firebase.setGameCards(this.props.gameId, this.state.cards)
    this.props.firebase.setGameSets(this.props.gameId, this.props.playerName, this.state.sets)
  }

  async startGame() {
    await this.setShuffledCards(this.cardsNew)
    await this.props.firebase.setGameCards(this.props.gameId, this.state.cards)
    await this.setState({ gameStarted: true })
  }

  async joinGame() {
    const cards = await this.props.firebase.getGameCards(this.props.gameId)
    console.log({ cards })
    await this.setState({ cards })
    await this.setState({ gameStarted: true })
  }

  subscribeOpponentSets() {
    this.props.firebase.onGameOpponentPlayerSetsUpdate(this.props.gameId, this.props.opponentName);

    (document as any).addEventListener('opponentSetsUpdate', (event: { detail: Card[][] }) => {
      console.log(event.detail)
      this.setState({ opponentSets: event.detail })
    })
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

  validate(cards: Card[]) {
    if (this.getIsSet(cards) === false) {
      this.removeSet(cards)
    } else {
      this.addSet(cards)

      if (this.state.cards.length > (MAX_CARDS_SHOWN + cards.length)) {
        this.replaceCards(cards)
      } else {
        this.removeCards(cards)
      }
    }
  }

  validateCombinations() {
    if (this.cardCombinationsSets.length > 0 || this.state.gameEnded === true) {
      return
    }

    if (this.state.cards.length < MAX_CARDS_SHOWN) {
      this.setState({ gameEnded: true })
      return
    }

    this.setShuffledCards(this.state.cards)
  }

  addSet(cards: Card[]) {
    this.setState({
      sets: [
        ...this.state.sets,
        cards,
      ]
    })
  }

  removeSet(cards: Card[]) {
    this.setState({
      sets: this.state.sets.filter((_, index) => index !== 0),
    })
  }

  removeCards(cards: Card[]) {
    this.setState({
      cards: this.state.cards.filter((c) => !cards.map((c) => c.id).includes(c.id))
    })
  }

  replaceCards(cards: Card[]) {
    const replacedCards = this.state.cards.map((card) => {
      const cardsToReplace = cards.map((c) => c.id)
      if (cardsToReplace.includes(card.id)) {
        card = this.state.cards[MAX_CARDS_SHOWN + cardsToReplace.indexOf(card.id)]
      }
      return card
    })
    replacedCards.splice(MAX_CARDS_SHOWN, 3)

    this.setState({ cards: replacedCards })
  }

  render() {
    return (
      <div>
        {this.state.gameEnded ? <h1>Game Ended!</h1> : ''}
        <PlayStats
          gameId={this.props.gameId}
          firebase={this.props.firebase}
          sets={this.state.sets.length}
          setsAvailable={this.cardCombinationsSets.length}
          cardsLeft={this.state.cards.length}
          playerName={this.props.playerName}
          opponentName={this.props.opponentName}
          opponentSets={this.state.opponentSets.length}
          gameEnded={this.state.gameEnded}
        />
        <PlayBoard
          cards={this.cardsShown}
          onValidate={(cards) => this.validate(cards)}
        />
      </div>
    );
  }
}
