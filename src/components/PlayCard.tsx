import * as React from 'react';
import './PlayCard.css'
import { Card } from 'src/types';

interface CardProps {
  card: Card
  active: boolean
  onClick: () => void
}

export class PlayCard extends React.Component<CardProps, {}> {
  constructor(props: CardProps) {
    super(props);

    this.state = {}
  }

  get amount(): number {
    return this.props.card.amount
  }

  get color(): string {
    return this.props.card.color
  }

  get shape(): string {
    return this.props.card.shape
  }

  get fill(): string {
    return this.props.card.fill
  }

  get elements(): JSX.Element[] {
    const elements = []
    for (let index = 0; index < this.amount; index++) {
      elements.push(<div key={index} style={{ background: this.color }}>{this.shape} - {this.fill}</div>)
    }
    return elements
  }

  get classNames(): string {
    const classes = ['play-card']
    if (this.props.active) {
      classes.push('play-card__active')
    }
    return classes.join(' ')
  }

  click() {
    console.log('alive')
  }

  render() {
    return (
      <div className={this.classNames} onClick={this.props.onClick}>
        {this.elements}
      </div>
    );
  }
}
