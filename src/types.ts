export enum Color {
  RED = 'red',
  PURPLEE = 'purple',
  GREEN = 'green',
}

export enum Shape {
  SQUIGGLE = 'squiggle',
  DIAMOND = 'diamod',
  OVAL = 'oval',
}

export enum Fill {
  SOLID = 'solid',
  STRIPED = 'striped',
  OPEN = 'open',
}


export interface Card {
  id: number
  color: Color
  shape: Shape
  fill: Fill
  amount: number
}

export enum Player {
  SELF = 'self',
  OTHER = 'other',
}
