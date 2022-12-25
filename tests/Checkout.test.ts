import Checkout from "../src/Checkout";
import Mailer from "../src/Mailer";
import MailerConsole from "../src/MailerConsole";
import sinon from "sinon";
import ProductData from "../src/ProductData";
import CouponData from "../src/CouponData";

const productData: ProductData = {
  async getProduct(idProduct: number): Promise<any> {
    const products: { [idProduct: number]: any } = {
      1: { idProduct: 1, description: "A", price: 1000, width: 100, height: 30, length: 10, weight: 3, currency: "BRL" },
      2: { idProduct: 2, description: "B", price: 5000, width: 50, height: 50, length: 50, weight: 22, currency: "BRL" },
      3: { idProduct: 3, description: "C", price: 30, width: 10, height: 10, length: 10, weight: 0.9, currency: "BRL" },
      4: { idProduct: 4, description: "D", price: 100, width: 100, height: 30, length: 10, weight: 3, currency: "USD" },

    }
    return products[idProduct];
  }
}

const couponData: CouponData = {
  async getCoupon(code: string): Promise<any> {
    const coupons: any = {
      "VALE20": { code: "VALE20", percentage: 20, expire_date: new Date("2022-12-01T10:00:00") },
      "VALE20_EXPIRED": { code: "VALE20_EXPIRED", percentage: 20, expire_date: new Date("2022-10-01T10:00:00") }
    }
    return coupons[code];
  }
}

test('Deve enviar um email ao final do checkout', async () => {
  const mailerSpy = sinon.spy(MailerConsole.prototype, 'send');
  const input = {
    cpf: '987.654.321-00',
    itens: [
      { productId: 1, quantity: 1 },
      { productId: 2, quantity: 2 },
      { productId: 3, quantity: 3 },
    ],
    email: 'test@example.com'
  }
  const checkout = new Checkout(productData, couponData);
  await checkout.execute(input);
  expect(mailerSpy.calledOnce).toBeTruthy();
  expect(mailerSpy.calledWith('test@example.com', 'Checkout Success', 'Total price: 11350')).toBeTruthy();
  mailerSpy.restore();
})