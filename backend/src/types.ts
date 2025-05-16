export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  embedding: number[];
  imageUrl: string;
}
