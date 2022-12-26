export interface IProduct {
  id: number;
  description: string;
  price: number;
  height: number;
  width: number;
  length: number;
  weight: number;
  currency: string;
}

export default interface ProductData {
  getProduct(id: number): Promise<IProduct>;
};
