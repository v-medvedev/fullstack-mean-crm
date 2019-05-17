import {Injectable} from "@angular/core";
import {Order, OrderItem, Position} from "../shared/interfaces";

@Injectable()
export class OrderService {

  public list: OrderItem[] = [];
  public price = 0;

  add(position: Position) {
    const orderItem: OrderItem = Object.assign({}, {
      name: position.name,
      cost: position.cost,
      quantity: position.quantity,
      _id: position._id
    });
    const candidate = this.list.find(p => p._id === orderItem._id);
    if (candidate) {
      candidate.quantity += orderItem.quantity;
    } else {
      this.list.push(orderItem);
    }
    // Calculate total price
    this.computePrice();
  }

  remove(item: OrderItem) {
    const idx = this.list.findIndex((i: OrderItem) => i._id === item._id);
    this.list.splice(idx, 1);
    this.computePrice();
  }

  clear() {
    this.list = [];
    this.price = 0;
  }

  private computePrice() {
    this.price = this.list.reduce((total, current) => {
      total += current.quantity * current.cost;
      return total;
    }, 0);
  }

}
