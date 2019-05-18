export interface User {
  email: string;
  password: string;
}

export interface Category {
  name: string;
  imageSrc?: string;
  user?: string;
  _id?: string;
}

export interface Position {
  name: string;
  cost: number;
  user?: string;
  category: string;
  _id?: string;
  quantity?: number;
}

export interface Order {
  date?: Date;
  order?: number;
  list: OrderItem[];
  user?: string;
  _id?: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  cost: number;
  _id?: string;
}

export interface Filter {
  order?: number;
  start?: Date;
  end?: Date;
}

export interface Message {
  message: string;
}
