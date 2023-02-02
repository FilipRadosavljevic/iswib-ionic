export class Product {
  constructor(
    public productID: string,
    public name: string,
    public price: number,
    public image: string,
    public quantity: number,
    public size?: string
  ) {}
}
