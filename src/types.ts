export enum Color {
  RED = 'red',
  PURPLEE = 'purple',
  GREEN = 'green',
}

export enum Shape {
  DIAMOND = 'diamod',
  SQUIGGLE = 'squiggle',
  OVAL = 'oval',
}

export enum Fill {
  SOLID = 'solid',
  STRIPED = 'striped',
  OPEN = 'open',
}


export interface Card {
  color: Color
  shape: Shape
  fill: Fill
  amount: number
}

