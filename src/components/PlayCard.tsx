import * as React from 'react';
import './PlayCard.css'
import { Card } from 'src/types';

interface Props {
  card: Card
  active: boolean
  onClick: () => void
}

export class PlayCard extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);

    this.state = {}
  }

  get imageSrc(): string {
    return `https://www.setgame.com/sites/all/modules/setgame_set/assets/images/new/${this.props.card.id}.png`
  }

  get classNames(): string {
    const classes = ['play-card']
    if (this.props.active) {
      classes.push('play-card__active')
    }
    return classes.join(' ')
  }

  render() {
    return (
      <div className={this.classNames} onClick={this.props.onClick}>
        <img className="playcard__image" src={this.imageSrc} alt="card" />
      </div>
    );
  }
}
