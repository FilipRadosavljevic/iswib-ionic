import { Size } from './product.model'

export type OrderProduct = {
  productId: string
  name: string
  price: number
  quantity: number
  total: number
  size: Size
}

export class Order {
  constructor(
    public orderId: string,
    public userId: string,
    public userEmail: string,
    public status: string,
    public createdOn: Date,
    public updatedOn: Date,
    public completedOn: Date,
    public total: number,
    public products: OrderProduct[],
  ) {}
}
