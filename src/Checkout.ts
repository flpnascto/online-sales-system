import pgp from "pg-promise";
import CouponData from "./CouponData";
import ProductData from "./ProductData";
import validateCPF from "./utils/validateCPF";
import Mailer from "./Mailer";
import MailerConsole from "./MailerConsole";

interface IOrderProduct {
  productId: number;
  quantity: number;
}

interface IOrder {
  cpf: string;
  itens: IOrderProduct[];
  coupon?: string;
  email: string;
}

export default class Checkout {
  readonly db = pgp()('postgres://postgres:postgres@localhost:3002');

  constructor(
    readonly product: ProductData,
    readonly coupon: CouponData,
    readonly mailer: Mailer = new MailerConsole()
  ) { }

  async execute(input: IOrder) {
    if (!validateCPF(input.cpf)) {
      throw new Error('Invalid CPF');
    }
    let totalPrice = 0;
    const productsIds: number[] = [];
    let freight = 0
    for (const item of input.itens) {
      if (item.quantity <= 0) {
        throw new Error('Product quantity must be positive number');
      }
      if (productsIds.some((id) => id === item.productId)) {
        throw new Error('Duplicated product');
      } else {
        productsIds.push(item.productId);
      }
      const product = await this.product.getProduct(item.productId);
      if (product) {
        // Valor do Frete = distância (km) * volume (m3) * (densidade/100)
        const distance = 1000;
        const volume = (product.height / 100) * (product.width / 100) * (product.length / 100);
        const density = product.weight / volume;
        const itemFreight = distance * volume * density / 100;
        freight += (itemFreight >= 10) ? itemFreight : 10;
        totalPrice += product.price * item.quantity;
      } else {
        throw new Error('Product not found')
      };
    };
    if (input.coupon) {
      const coupon = await this.coupon.getCoupon(input.coupon)
      if (coupon && coupon.expire_date.getTime() > (new Date()).getTime()) {
        totalPrice -= (totalPrice * coupon.percentage) / 100;
      }
    }
    totalPrice += freight;
    const { id } = await this.db.one('INSERT INTO sales_system.orders(total_price) VALUES($1) RETURNING id', [totalPrice])
    if (input.email) {
      this.mailer.send(input.email, 'Checkout Success', `Total price: ${totalPrice}`);
    }
    return { id, totalPrice }
  }
}
