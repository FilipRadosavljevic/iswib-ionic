export type Size = 'S' | 'M' | 'L' | 'XL'

export type Orders = {
  [S in Size]: number
}

export class Product {
  constructor(
    public productId: string,
    public name: string,
    public price: number,
    public orders: Orders,
    public imageUrl: string,
  ) {}

  // get totalPrice() {
  //   const { S, M, L, XL } = this.orders
  //
  //   return this.price * (S + M + L + XL)
  // }
}
